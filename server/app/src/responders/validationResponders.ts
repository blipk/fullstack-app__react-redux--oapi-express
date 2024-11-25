/**
 * This file contains typing and classes that generate the APIs validation error responses
 * @module
 */

import type { FieldErrors } from "tsoa"
import type { ValidationErrorItem } from "@sequelize/core"

import { validate } from "class-validator"
import type { ValidationError, ValidatorOptions } from "class-validator"
import { plainToInstance, instanceToPlain, type ClassConstructor } from "class-transformer"

import type { InstanceProperties } from "../utils/typeUtils.ts"
import { ErrorResponder, type ErrorResponseBody } from "./errorResponders.ts"

/** Default options used in `class-validator`'s `validate` method */
const classValidatorDefaultOptions: ValidatorOptions = {
    // stopAtFirstError: true
    // skipMissingProperties: false // This is set on PATCH/UPDATE because partials are allowed
    // whitelist: true, forbidNonWhitelisted: true
}

/**
 * This is a wrapper for `class-transformer` that wraps {@link classValidator}
 *
 * @param objectsPlain - A single or an array of of plain objects corresponding to the properties of objectClass
 * @param objectClass - The class to instantiate from the plain object
 * @param ignoredPropertyKeys - Optional keys to not validate, even if they are provided
 * @param deletedPropertyKeys - Optional keys to delete from the plain object(s)
 * @param extraValidatorOptions - Optional extra options to pass to class-validator's validate method
 *
 * @returns A tuple containing 3 items:
 *
 * 1. Array of flattened `class-validator` `ValidationError`'s (if any) for all the {@link objectsPlain}
 * 2. Array of a plain objects representing the instances' properties with any properties removed via deletedPropertyKeys
 * 3. Array of instances of `objectClass`'s constructed from the array of `objectPlain`'s
 */
const validator = async <T extends object>(
    objectsPlain: object[] | object, //Array<InstanceProperties<T>>
    objectClass: ClassConstructor<T>,
    ignoredPropertyKeys?: Array<keyof T>,
    deletedPropertyKeys?: Array<keyof T>,
    extraValidatorOptions?: ValidatorOptions
): Promise<[
        ValidationError[],
        Array<InstanceProperties<T>>,
        T[]
    ]> => {

    const objectInstanceOrInstances = plainToInstance( objectClass, objectsPlain )
    const objectInstances: Array<InstanceProperties<T>> =
        Array.isArray( objectInstanceOrInstances ) ? objectInstanceOrInstances : [ objectInstanceOrInstances ]

    const allValidationErrors = []
    const plainObjects = []
    const returnObjectInstances = []
    for ( const objectInsance of objectInstances ) {
        const [ validationErrors, plainObject, returnObjectInstance ] = await classValidator(
            objectInsance, ignoredPropertyKeys, deletedPropertyKeys, extraValidatorOptions
        )
        allValidationErrors.push( ...validationErrors )
        plainObjects.push( plainObject )
        returnObjectInstances.push( returnObjectInstance )
    }

    return [ allValidationErrors, plainObjects, returnObjectInstances ]
}

/** A partial type of a property we know will be on our validator classes */
type DTOPartial<T> = object & { setShouldValidate?: ( key: keyof T, value: boolean ) => void }

/**
 * This is a wrapper for `class-validator`'s `validate` method so we can allow circumstantial validation and provide consistent options
 *
 * See {@link generators/class-validator-generator} and {@link data/models/validationModels} for how the circumstantial validation works
 *
 * @param objectInstance - An instance of a class with calss validator decorators
 * @param ignoredPropertyKeys - Optional keys to not validate, even if they are provided
 * @param deletedPropertyKeys - Optional keys to delete from the retyrbed okaub object
 * @param extraValidatorOptions - Optional extra options to pass to class-validator's validate method
 *
 * @returns A tuple containing 3 items:
 *
 * 1. Array of `class-validator` `ValidationError`'s (if any).
 * 2. A plain object representing the instances properties with any properties removed via deletedPropertyKeys
 * 3. The objectInstance passed in, with no changes
 */
const classValidator = async <T extends object>(
    objectInstance: T, //T,
    ignoredPropertyKeys?: Array<keyof T>,
    deletedPropertyKeys?: Array<keyof T>,
    extraValidatorOptions?: ValidatorOptions
): Promise<[
        ValidationError[],
        InstanceProperties<typeof objectInstance>,
        T
    ]> => {

    ignoredPropertyKeys?.forEach(
        key => {
            ( objectInstance as DTOPartial<T> ).setShouldValidate?.( key, false )
        }
    )

    const validationErrors = await validate( objectInstance, { ...classValidatorDefaultOptions, ...extraValidatorOptions } )

    const plainObject = instanceToPlain( objectInstance ) as InstanceProperties<typeof objectInstance>

    deletedPropertyKeys?.forEach(
        key => {
            if ( key in plainObject )
                // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                delete plainObject[ key ]
                // if ( key in objectInstance )
                //      delete objectInstance[ key as keyof T ]
        }
    )


    return [ validationErrors, plainObject, objectInstance ]
}


/**
 * This is used for raising errors from `class-validator` `ValidationError[]`
 *
 * These are handled by the servers global error handler in {@link index}
 */
class ClassValidationError extends Error {

    public readonly classValidatorErrors: ValidationError[]
    public readonly contentMessage: string

    /**
     * @param classValidatorErrors - The errors from {@link validator} or `class-validator`'s `validate` method
     */
    constructor(
        classValidatorErrors: ValidationError[],
    ) {
        type ConstraintsType = Record<string, string>;
        const constraintsToMesssage = ( constraints: ConstraintsType = {} ) => Object.keys( constraints ).map(
            constraintName => `${constraints[ constraintName ]} [${constraintName}]`
        ).join( ", " )

        const classValidationErrorToMessage = ( err: ValidationError ) =>
            `Error validating ${err.target?.constructor.name}.${err.property}='${err.value}' (${constraintsToMesssage( err.constraints )}) `

        const flattenValidationErrors = ( error: ValidationError ): ValidationError[] => {
            return error.children ? error.children.reduce( ( acc, child ) => {
                return acc.concat( flattenValidationErrors( child ) )
            }, [ error ] ) : [ error ]
        }

        const allValidationErrors = classValidatorErrors.map(
            err => flattenValidationErrors( err )
        ).flat()

        const allMessages = allValidationErrors.map( err =>
            classValidationErrorToMessage( err )
        )

        const messages = allMessages.join( "\n" )

        super( "Class Validation Error" )

        this.contentMessage = messages
        this.classValidatorErrors = classValidatorErrors
    }
}

/** This is used for validation errors related to controller route query parameters */
class QueryValidationError extends Error {
    public readonly queryFieldName: string
    public readonly queryFieldValue: string
    public readonly queryFieldFailureMessage?: string

    /**
     *
     * @param queryFieldName - The name of the query parameter that failed validation
     * @param queryFieldValue - The value of the query parameter that failed validation
     * @param queryFieldFailureMessage - An optional message detailing why validation was failed
     */
    constructor(
        queryFieldName: string,
        queryFieldValue: string,
        queryFieldFailureMessage?: string,
    ) {
        const queryFieldFailureMessageDisplay = queryFieldFailureMessage ? ` (${queryFieldFailureMessage})` : ""
        const message =
            `Failed query validation on parmeter '${queryFieldName}=${queryFieldValue}'${queryFieldFailureMessageDisplay}`

        super( message )
        this.queryFieldName = queryFieldName
        this.queryFieldValue = queryFieldValue
        this.queryFieldFailureMessage = queryFieldFailureMessage
    }
}


/** This is the fixed literal type for {@link ValidationErrorResponseBody.message} */
type ValidationErrorMessageT = "Validation Failed"

/**
 * This is the types acceptable for {@link ValidationErrorResponseContent.expandedDetails}
 * Differs between class-validator, TSOA or Sequelize - Typesript struggles with TModelAttributes from ValidationErrorItem.model
 */
type ValidationErrorDetailsTypes = ValidationError[] | FieldErrors | Array<Omit<ValidationErrorItem, "instance">>

/** Represents the content for {@link ValidationErrorResponseBody.errors} */
interface ValidationErrorResponseContent {
    details: string;
    message: string;
    expandedDetails?: ValidationErrorDetailsTypes;
}

/**
 * Represents the response body for a validation error
 *
 * Used by internal {@link QueryValidationError} and {@link ClassValidationError},
 * as well as `sequelize`.{@link ValidationError} and `tsoa`.`ValidateError`
 */
type ValidationErrorResponseBody = ErrorResponseBody<ValidationErrorResponseContent, ValidationErrorMessageT>

/**
 * This is used for constructing the response body for validation errors
 */
class ValidationErrorResponder {
    static readonly validationMessage: ValidationErrorMessageT = "Validation Failed"
    static readonly status = 422 as const

    /** This creates a {@link ValidationErrorResponseContent} */
    static ResponseContent = (
        details: string,
        contentMessage: string,
        expandedDetails?: ValidationErrorDetailsTypes
    ): ValidationErrorResponseContent[] =>
        [
            {
                details         : details,
                message         : contentMessage,
                expandedDetails : expandedDetails,
            }
        ]

    /** This creates a {@link ValidationErrorResponseBody} */
    static Response = (
        details: string,
        contentMessage: string,
        expandedDetails?: ValidationErrorDetailsTypes
    ): ValidationErrorResponseBody =>
        ErrorResponder.Response(
            this.ResponseContent( details, contentMessage, expandedDetails ),
            this.validationMessage
        )

}


export type {
    ValidationErrorMessageT,
    ValidationErrorResponseBody,
    ValidationErrorResponseContent,
    ValidationErrorDetailsTypes,

    ValidationError // re-export
}

export {
    ValidationErrorResponder,
    ClassValidationError, QueryValidationError,
    classValidatorDefaultOptions,
    validator, classValidator,
    plainToInstance, instanceToPlain // re-exports
}