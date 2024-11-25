/**
 * This file generates class-validator models from the already defined sequelize class models
 *
 * The purpose of this is to use them as DTOs with TSOA as it's not ideal to use the database models directly
 *
 * The generated models are output here: {@link data/models/validationModels}
 *
 * @module
 */
import fs from "fs"
import path from "path"
import "reflect-metadata"

import type { DataTypes, IncludeOptions } from "@sequelize/core"
import { type ModelStatic, type NormalizedAttributeOptions } from "@sequelize/core"

import { allModels, AppModelNotAbstract } from "../data/models/models.ts"
import { dbMaker, connectDB, shutdownDB } from "../data/connector.ts"

import config, { ensureDevMode } from "../config/config.ts"
import { getAppRoot } from "../utils/utils.ts"
import type { NormalizedDataType } from "@sequelize/core/_non-semver-use-at-your-own-risk_/abstract-dialect/data-types.js"

ensureDevMode()

const mapSequelizeAttrToTypescriptType = ( attr: NormalizedAttributeOptions, overrideType?: string ): string => {
    const sequelizeType = overrideType || attr.type.constructor.name.toLowerCase()

    switch ( sequelizeType ) {
    case "integer":
    case "float":
    case "double":
    case "real":
        return "number"

    case "date":
    case "datetime":
        return "Date"

    case "blob":
        return "string | Buffer"

    case "text":
    case "string":
        return attr.validate?.notEmpty === true
            ? "NonEmptyString"
            : "string"

    case "boolean":
        return "boolean"

    case "enum": {
        // Sequelize doesn't provide good meta typing for this
        type CoercedEnumType = typeof DataTypes.ENUM & {options: {values: string[]}}
        const enumValues =  ( attr.type as unknown as CoercedEnumType ).options.values
        const enumValuesType = enumValues.map( v => `"${v}"` ).join( " | " )
        return enumValuesType
    }

    case "virtual": {
        type VirtualAttrType = NormalizedDataType & { options: {returnType: object} }
        const typeAsString = ( attr.type as VirtualAttrType ).options.returnType.constructor.name.toLowerCase()
        return mapSequelizeAttrToTypescriptType( attr, typeAsString )
    }

    default:
        throw new Error( `Unhandled sequelize type: ${sequelizeType}` )
        // return sequelizeType
    }
}

interface enumRep {
    name: string,
    values: string[]
}

const mapSequelizeAttrToValidatorDecorator = ( attr: NormalizedAttributeOptions, overrideType?: string ): [string[], enumRep?] => {
    let enumRep
    const decorators: string[] = []
    const sequelizeType = overrideType || attr.type.constructor.name.toLowerCase()
    let isString = false
    let isNumber = false


    switch ( sequelizeType ) {
    case "integer":
        decorators.push( "@IsInt()" )
        isNumber = true
        break

    case "float":
    case "double":
    case "real":
        decorators.push( "@IsNumber()" )
        isNumber = true
        break

    case "date":
    case "datetime":
        decorators.push( "@IsDate()" )
        break

    case "blob":
        decorators.push( "@IsStringOrBuffer()" )
        break

    case "text":
    case "string":
        decorators.push( "@IsString()" )
        isString = true
        break

    case "boolean":
        decorators.push( "@IsBoolean()" )
        break

    case "enum": {
        type CoercedEnumType = typeof DataTypes.ENUM & { options: { values: string[] } };
        const enumValues = ( attr.type as unknown as CoercedEnumType ).options.values.map( v => `"${v}"` )
        const enumName = attr.attributeName
        enumRep = {
            name   : enumName,
            values : enumValues
        }
        decorators.push( `@IsEnum( ${enumName} )` )
        break
    }

    case "virtual": {
        type VirtualAttrType = NormalizedDataType & { options: {returnType: object} }
        const typeAsString = ( attr.type as VirtualAttrType ).options.returnType.constructor.name.toLowerCase()
        return mapSequelizeAttrToValidatorDecorator( attr, typeAsString )
    }

    default:
        throw new Error( `Unhandled sequelize type: ${sequelizeType}` )
    }

    // console.log( attr.attributeName, attr.allowNull )

    if ( attr.allowNull === false )
        // @IsDefined() Ignores `skipMissingProperties` in `validate` method
        // We prefer to use @IsNotEmpty() as we handle partials with #shouldValidate
        decorators.push( "@IsNotEmpty()" )
        // decorators.push( "@IsDefined()" )
    else
        decorators.push( "@IsOptional()" )

    if ( attr.validate?.notEmpty && ( isString || isNumber ) )
        decorators.push( "@MinLength( 1 )" )

    if ( attr.validate?.isEmail )
        decorators.push( "@IsEmail()" )

    if ( attr.validate?.is ) {
        type valType = string | ReadonlyArray<string | RegExp> | RegExp
        interface asArgs { msg: string; args?: valType }
        const val = ( attr.validate.is as asArgs ).args ?? attr.validate.is
        if ( Array.isArray( val ) )
            decorators.push(
                ...val.map( v => `@Matches(${( v )})` )
            )
        else
            decorators.push( `@Matches(${( ( val as valType ).toString() )})` )
    }

    if ( attr.validate?.isUrl )
        decorators.push( "@IsUrl()" )

    if ( attr.validate?.isIP || attr.validate?.isIPv4 )
        decorators.push( "@IsIP( \"4\" )" )

    if ( attr.validate?.isIP || attr.validate?.isIPv6 )
        decorators.push( "@IsIP( \"6\" )" )

    if ( attr.validate?.isAlpha )
        decorators.push( "@IsAlpha()" )

    if ( attr.validate?.isAlphanumeric )
        decorators.push( "@IsAlphanumeric()" )

    if ( attr.validate?.isNumeric )
        decorators.push( "@IsNumber()" )

    if ( attr.validate?.isInt )
        decorators.push( "@IsInt()" )

    if ( attr.validate?.isFloat || attr.validate?.isDecimal )
        decorators.push( "@IsNumber()" )

    if ( attr.validate?.isLowercase )
        decorators.push( "@IsLowercase()" )

    if ( attr.validate?.isUppercase )
        decorators.push( "@IsUppercase()" )

    if ( attr.validate?.isIn || attr.validate?.notIn ) {
        const decoratorName = attr.validate.isIn ? "@IsIn" : "@IsNotIn"
        type valType = ReadonlyArray<string | RegExp> | RegExp
        interface asArgs { msg: string; args?: valType }
        const val = ( attr.validate.is as asArgs ).args ?? attr.validate.is
        if ( Array.isArray( val ) )
            decorators.push(
                ...val.map( v => `@${decoratorName}(${( v )})` )
            )
        else
            decorators.push( `@${decoratorName}(${( ( val as valType ).toString() )})` )
    }

    if ( attr.validate?.min && isNumber ) {
        interface asArgs { msg: string; args?: readonly [number] }
        const val = Number( ( attr.validate.min as asArgs ).args ?? attr.validate.min )
        decorators.push( `@Min( ${val} )` )
    }

    if ( attr.validate?.max && isNumber ) {
        interface asArgs { msg: string; args?: readonly [number] }
        const val = Number( ( attr.validate.min as asArgs ).args ?? attr.validate.min )
        decorators.push( `@Max( ${val} )` )
    }

    if ( attr.validate?.len && isString ) {
        interface asArgs { msg: string; args?: readonly [number, number] }
        const [ minLength, maxLength ] = ( ( attr.validate.len as asArgs ).args ?? attr.validate.len ) as [number, number]
        decorators.push( `@MinLength( ${minLength} )` )
        decorators.push( `@MaxLength( ${maxLength} )` )
    }

    // TODO
    //.equals
    //.contains
    //.notcontains
    // isUUID?: number | { msg: string; args: number };
    // isDate?: boolean | { msg: string; args: boolean };
    // isAfter?: string | { msg: string; args: string };
    // isBefore?: string | { msg: string; args: string };
    // max?: number | { msg: string; args: readonly [number] };
    // min?: number | { msg: string; args: readonly [number] };
    // isArray?: boolean | { msg: string; args: boolean };
    // isCreditCard?: boolean | { msg: string; args: boolean };

    return [ [ ...new Set( decorators ) ], enumRep ]
}

interface AttributeDetails {
    tsType: string,
    nullable: boolean,
    validationDecorators: string[]
    enumRep?: enumRep
}
type AttributesWithDetails = Record<string, AttributeDetails>

const extractAttributes = ( model: ModelStatic ): AttributesWithDetails => {
    const attributes = [ ...model.modelDefinition.attributes.values() ]

    const ignoredAttributeTypes: string[] = []//[ "virtual" ]
    const attributesWithDetails = attributes
        .filter( attr => !( ignoredAttributeTypes.includes( attr.type.constructor.name.toLowerCase() ) ) )
        .map(
            attr => {
                const [ validationDecorators, enumRep ] = mapSequelizeAttrToValidatorDecorator( attr )
                const tsType = mapSequelizeAttrToTypescriptType( attr )
                const dataTypeName = attr.type.constructor.name.toLowerCase()
                const nullable = dataTypeName === "virtual" ? true : attr.allowNull
                return [
                    attr.attributeName,
                    {
                        tsType               : tsType,
                        nullable             : nullable,
                        validationDecorators : validationDecorators,
                        enumRep              : enumRep
                    }
                ]
            }
        )

    // Add properties for associations which are NonAttributes
    const modelWithAssociations = model as unknown as { establishScopes?: { defaultScope?: {include?: Array<IncludeOptions | string>} } }
    const associationAttributes =
             modelWithAssociations.establishScopes?.defaultScope?.include?.map( ( include: IncludeOptions | string ) => {
                 const includeName = ( typeof include === "string" ? include : include.association ) as string
                 const [ first, ...rest ] = includeName
                 const capitalizedIncludeName = first.toUpperCase() + rest.join( "" )

                 const type = includeName.endsWith( "s" )
                     ? capitalizedIncludeName.slice( 0, capitalizedIncludeName.length-1 ) + "ModelDTO[]"
                     : capitalizedIncludeName + "ModelDTO"

                 return [
                     includeName,
                     {
                         tsType               : type, //"unknown[] | Record<string, unknown>",
                         nullable             : true, // TODO: Check this for different associations
                         validationDecorators : [],
                         enumRep              : undefined
                     }
                 ]
             } ) || []

    return Object.fromEntries( [ ...attributesWithDetails, ...associationAttributes ] ) as AttributesWithDetails
}

const generateValidatorModel = (
    attributesWithDetailsIn: AttributesWithDetails, model: ModelStatic, baseModel: ModelStatic
): [string, AttributesWithDetails] => {
    const modelName = model.modelDefinition.modelName
    const isAppModel = model === baseModel

    const DTOName = modelName.replace( "NotAbstract", "" ) + "DTO"

    // This is used for allowing circumstantial validation on specific properties
    // We could use validation groups instead, but sequelize doesn't expose it's CreationOptional attributes,
    // so I can't programatically generate the groups
    const attributesWithDetails =
        Object.fromEntries(
            Object.entries( attributesWithDetailsIn )
                .map( ( [ attrName, value ] ) => {
                    const validateIfDecorator = `@ValidateIf( ( o: ${DTOName} ) => o.#shouldValidate.${attrName} )`
                    const newValidationDecorators = [ validateIfDecorator ].concat( value.validationDecorators )
                    const newValue = { ...value, ...{ validationDecorators: newValidationDecorators } }
                    return [ attrName, newValue ]
                } )
        )

    const mappedProperties = Object.entries( attributesWithDetails )
        .map( ( [ name, { tsType, nullable, validationDecorators } ] ) =>
            `    ${validationDecorators.join( "\n    " )}\n    declare ${name}${nullable ? "?" : ""}: ${tsType}\n` )


    const allAttributeNames = Object.keys( attributesWithDetails )
    // const keySpacingLength = allAttributeNames.sort( ( a, b ) => b.length - a.length )[ 0 ].length
    const keySpacingLength = Math.max( ...allAttributeNames.map( str => str.length ) )
    // const keySpacing = " ".repeat( keySpacingLength - attrName.length )
    const allAttributeNamesProperties = allAttributeNames.map(
        attrName => `        "${attrName}" ${" ".repeat( keySpacingLength - attrName.length )}: true`
    )

    // TODO: Should I update the validator with a `optionalKeys` option and only validate them if they are not undefined

    const shouldValidateProperty = `\n    #shouldValidate: Record<string, boolean> = {\n${allAttributeNamesProperties.join( ",\n" )}\n    }
\n    setShouldValidate( key: string, value: boolean ): void { this.#shouldValidate[ key ] = value }\n`

    const validatorClassString =
`/** DTO Model for Sequalize Model {@link data/models/models.${modelName}} */
export class ${DTOName}${isAppModel ? "" : " extends AppModelDTO"} {

${mappedProperties.join( "\n" )}
${shouldValidateProperty}}
`

    return [ validatorClassString, attributesWithDetails ]
}

const convertDBModelToValidatorModel = ( model: ModelStatic, baseModel: ModelStatic ): [string, AttributesWithDetails] => {
    const attributesData = extractAttributes( model )
    const [ validatorModelString, updatedAttributesData ] = generateValidatorModel( attributesData, model, baseModel )

    return [ validatorModelString, updatedAttributesData ]
}

const convertDBModelsToValidatorModels = async (
    baseModel: ModelStatic,
    modelsIn: ModelStatic[],
    doShutdownDB = true
): Promise<void> => {
    console.log( "Generating class-validator models..." )

    const _ = dbMaker( {
        storage : `${config.db.storageDir}/tmpdb.db`,
        models  : [ baseModel ]
    } )

    const models = [ baseModel, ...modelsIn ]

    await connectDB()

    const validatorModelsData = models.map( model => convertDBModelToValidatorModel( model, baseModel ) )
    const validatorModelsStrings = validatorModelsData.map( ( [ validatorModelString, _ ] ) => validatorModelString )
    const validatorModelsAttributesData = validatorModelsData.map( ( [ _, attributesData ] ) => attributesData )

    const allAtributeDetails = validatorModelsAttributesData.map(
        attributesData => Object.values( attributesData )
    ).flat()

    const allAttributeDetailsEnumReps = allAtributeDetails.map(
        attrDetails => attrDetails.enumRep
    ).filter( v => v !== undefined ).flat()

    const enumDeclarations = allAttributeDetailsEnumReps.map(
        ( { name, values } ) =>
            `enum ${name} {\n    ${values.join( ",\n    " )}\n}`
    ).join( "\n" )

    const allAttributeDetailsDecoators = allAtributeDetails.map(
        attrDetails => attrDetails.validationDecorators
    ).flat()

    const customValidatorNames = [ "IsStringOrBuffer" ]
    const decoratorImports = [ ...new Set(
        allAttributeDetailsDecoators.map(
            decorator => decorator.split( "@" )[ 1 ].split( "(" )[ 0 ]
        ) )
    ].filter( d => !customValidatorNames.includes( d ) )
        .sort( ( a, b ) => a.length - b.length )

    const customValidaors =
`import { registerDecorator, type ValidationOptions, type ValidationArguments } from "class-validator"

/** Custom \`clas-validator\` decorator to check if value is either a string or a Buffer */
export function IsStringOrBuffer( validationOptions?: ValidationOptions ) {
    return ( object: object, propertyName: string ): void => {
        registerDecorator( {
            name         : "isStringOrBuffer",
            target       : object.constructor,
            propertyName : propertyName,
            options      : validationOptions,
            validator    : {
                validate( value: unknown, _args: ValidationArguments ) {
                    return typeof value === "string" || Buffer.isBuffer( value ) // Check if value is a string or Buffer
                },
                defaultMessage( args: ValidationArguments ) {
                    return \`\${args.property} must be a string or a Buffer\`
                },
            },
        } )
    }
}`

    const outputFile =
`/**
 * DO NOT MODIFY: Automatically generated by {@link generators/class-validator-generator}
 *
 *  Contains \`class-validator\` models generated from \`sequelize\` models in {@link data/models/models}
 *
 *  These are used as DTOs for the applications \`tsoa\` controllers.
 *
 *  Each DTO has a property \`#shouldValidate\` and a method \`setShouldValidate\`
 *   that are used for conditional validation in {@link responders/validationResponders.validator}
 * @module
 */

import { \n    ${decoratorImports.join( ", \n    " )}\n} from "class-validator"
${customValidaors}

/** Represents a non-empty string */
export type NonEmptyString<T extends string = string> = T extends "" ? never : T

${enumDeclarations}

${validatorModelsStrings.join( "\n\n" )}`

    const appRoot = getAppRoot()
    const outputFilePath = path.join( appRoot, "src", "data", "models", "validationModels.ts" )
    fs.writeFileSync( outputFilePath, outputFile, "utf-8" )

    if ( doShutdownDB ) await shutdownDB()

    console.log( `Generation of class-validator models complete - saved at: ${outputFilePath}` )
}


const convertAllDBModelsToValidatorModels = async( doShutdownDB = false ): Promise<void> => {
    await convertDBModelsToValidatorModels( AppModelNotAbstract, allModels, doShutdownDB )
}


const isRunDirectly = import.meta.filename.includes( process.argv[ 1 ] )
if ( isRunDirectly )
    await convertAllDBModelsToValidatorModels( true )


export { convertDBModelsToValidatorModels }
export default convertAllDBModelsToValidatorModels