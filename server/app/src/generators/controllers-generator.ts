/**
 * This file generates tsoa controller files for a set of sequelize models from a template controller file.
 *
 * @module
 */

import fs from "fs"
import path from "path"

import type { ModelStatic } from "@sequelize/core"

import { allModels } from "../data/models/models.ts"
import { connectDB, shutdownDB } from "../data/connector.ts"

import { getAppRoot } from "../utils/utils.ts"
import { ensureDevMode } from "../config/config.ts"


ensureDevMode()


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const allModelNames = [ "RoleModel", "UserModel", "TagModel", "BlogModel", "FeedbackModel", "BookingModel", "BookingTypeModel" ]
type AllModelNamesT = typeof allModelNames[number]

interface PropertyKeyOptions {
    responseIgnored: { READ: string[], CREATE: string[], UPDATE: string[] }, // Not validated by validate()
    responseDeleted: { READ: string[], CREATE: string[], UPDATE: string[] }, // Deleted from plain object in validate()
    responseOptional: { READ: string[], CREATE: string[], UPDATE: string[] }, // Made optional in response type - should match requestOptional

    requestIgnored: { CREATE: string[], UPDATE: string[] }, // Not validated by validate()
    requestDeleted: { CREATE: string[], UPDATE: string[] }, // Deleted from plain object in validate()
    requestOptional: { CREATE: string[], UPDATE: string[] },
}

const propertyKeyOptions: Record<AllModelNamesT, PropertyKeyOptions> = {
    "RoleModel": {
        responseIgnored  : { READ: [], CREATE: [], UPDATE: [] },
        responseDeleted  : { READ: [], CREATE: [], UPDATE: [] },
        responseOptional : { READ: [], CREATE: [], UPDATE: [] },
        requestIgnored   : { CREATE: [], UPDATE: [] },
        requestDeleted   : { CREATE: [], UPDATE: [] },
        requestOptional  : { CREATE: [], UPDATE: [] },
    },
    "UserModel": {
        responseIgnored  : { READ: [ "password" ], CREATE: [ "password" ], UPDATE: [ "password" ] },
        responseDeleted  : { READ: [ "password" ], CREATE: [ "password" ], UPDATE: [ "password" ] },
        responseOptional : { READ: [], CREATE: [], UPDATE: [] },
        requestIgnored   : {
            CREATE : [ "profileText", "isAdmin", "isStaff", "fullName" ],
            UPDATE : [ "profileText", "isAdmin", "isStaff", "fullName" ]
        },
        requestDeleted: {
            CREATE : [ "isAdmin", "isStaff", "fullName" ],
            UPDATE : [ "isAdmin", "isStaff", "fullName" ]
        },
        requestOptional: { CREATE: [ "profileImageURL" ], UPDATE: [ "profileText" ] },
    },
    "TagModel": {
        responseIgnored  : { READ: [], CREATE: [], UPDATE: [] },
        responseDeleted  : { READ: [], CREATE: [], UPDATE: [] },
        responseOptional : { READ: [], CREATE: [], UPDATE: [] },
        requestIgnored   : { CREATE: [], UPDATE: [] },
        requestDeleted   : { CREATE: [], UPDATE: [] },
        requestOptional  : { CREATE: [], UPDATE: [] },
    },
    "BlogModel": {
        responseIgnored  : { READ: [], CREATE: [], UPDATE: [] },
        responseDeleted  : { READ: [], CREATE: [], UPDATE: [] },
        responseOptional : {
            READ   : [ "imageURL", "publishedDate" ],
            CREATE : [ "imageURL", "publishedDate" ],
            UPDATE : [ "imageURL", "publishedDate" ]
        },
        requestIgnored  : { CREATE: [ "user", "tags" ], UPDATE: [ "user", "tags" ] },
        requestDeleted  : { CREATE: [ "user", "tags" ], UPDATE: [ "user", "tags" ] },
        requestOptional : { CREATE: [ "imageURL", "publishedDate" ], UPDATE: [] },
    },
    "FeedbackModel": {
        responseIgnored  : { READ: [], CREATE: [], UPDATE: [] },
        responseDeleted  : { READ: [], CREATE: [], UPDATE: [] },
        responseOptional : { READ: [], CREATE: [], UPDATE: [] },
        requestIgnored   : { CREATE: [ "userId" ], UPDATE: [ "userId" ] },
        requestDeleted   : { CREATE: [], UPDATE: [] },
        requestOptional  : { CREATE: [ "isPublic", "userId" ], UPDATE: [] },
    },
    "BookingModel": {
        responseIgnored  : { READ: [], CREATE: [], UPDATE: [] },
        responseDeleted  : { READ: [], CREATE: [], UPDATE: [] },
        responseOptional : { READ: [], CREATE: [], UPDATE: [] },
        requestIgnored   : { CREATE: [ "bookingType" ], UPDATE: [ "bookingType" ] },
        requestDeleted   : { CREATE: [ "bookingType" ], UPDATE: [ "bookingType" ] },
        requestOptional  : { CREATE: [], UPDATE: [] },
    },
    "BookingTypeModel": {
        responseIgnored  : { READ: [], CREATE: [], UPDATE: [] },
        responseDeleted  : { READ: [], CREATE: [], UPDATE: [] },
        responseOptional : { READ: [], CREATE: [], UPDATE: [] },
        requestIgnored   : { CREATE: [], UPDATE: [] },
        requestDeleted   : { CREATE: [], UPDATE: [] },
        requestOptional  : { CREATE: [], UPDATE: [] },
    }
}

const allRouteNames = [ "getOne", "getMany", "create", "update", "delete" ]
type RouteNamesT = typeof allRouteNames[number]

/** Any routes that will be deleted from the controller */
const removedRoutes: Record<AllModelNamesT, RouteNamesT[]> = {
    "RoleModel"        : [],
    "UserModel"        : [],
    "TagModel"         : [],
    "BlogModel"        : [],
    "FeedbackModel"    : [],
    "BookingModel"     : [],
    "BookingTypeModel" : [],
}

interface SecuredRouteOptions {
    routeName: RouteNamesT,
    scopes: string
}

const routeSecurities = ( scopes: string, routeNames: RouteNamesT[] = [ "getOne", "getMany", "create", "update" , "delete" ] ) =>
    routeNames.map( routeName => (
        { routeName: routeName, scopes: scopes }
    ) )

/** `@Security` decorators and their scopes to be added to each route */
const securedRoutes: Record<AllModelNamesT, SecuredRouteOptions[]> = {
    "RoleModel" : routeSecurities( "securityScopeGroups.ADMIN" ),
    "UserModel" : [
        // getAll and getOne are handled by `securityFunctions` below
        ...routeSecurities( "securityScopeGroups.USER", [ "update" ] ),
        ...routeSecurities( "securityScopeGroups.ADMIN", [ "create", "delete" ] )
    ],
    "TagModel": [
        ...routeSecurities( "securityScopeGroups.STAFF" )
    ],
    "BlogModel": [
        ...routeSecurities( "securityScopeGroups.STAFF", [ "create", "update", "delete" ] ),
    ],
    "FeedbackModel": [
        ...routeSecurities( "securityScopeGroups.ADMIN", [ "delete" ] ),
    ],
    "BookingModel": [
        ...routeSecurities( "securityScopeGroups.USER" ),
    ],
    "BookingTypeModel": [
        ...routeSecurities( "securityScopeGroups.USER", [ "create", "update", "delete" ] ),
    ],
}

const makeSecurityDecorators = ( scopes: string ) =>
    !scopes ? "" : `@Security( SecurityTypes.API_KEY )
    @Security( SecurityTypes.OAuth2, ${scopes} )`

const routesToOperations: Record<RouteNamesT, string> = {
    "getOne"  : "Read",
    "getMany" : "ReadMany",
    "create"  : "Create",
    "update"  : "Update",
    "delete"  : "Delete"
}

interface AuthorizedRouteOptions {
    routeName: RouteNamesT,
    validators: string[]
}

const makeAuthorizationMiddlewareDecorators = ( validators: string[] ) =>
    !validators.length ? "" :`@Middlewares( authMiddleware( [
        ${validators.join( ",\n        " )}
    ] ) )`


/** Authorization middleware validators to be placed on each route */
const routeAuthorizations: Record<AllModelNamesT, AuthorizedRouteOptions[]> = {
    "RoleModel" : [ { routeName: "getOne", validators: [] } ],
    "UserModel" : [
        /** Handled by {@link securityFunctions} */
        // {
        //     routeName  : "getOne",
        //     validators : [ "" ]
        // },
        // {
        //     routeName  : "getMany",
        //     validators : [ "" ]
        // }
        {
            routeName  : "create",
            validators : [ "authValidators.userIsAdmin" ] // This is done through AuthService
        },
        {
            routeName  : "update",
            validators : [ "authValidatorsWithArgs.adminOr( [ authValidators.userIsResource ] )" ]
        },
    ],
    "TagModel"         : [ ],
    "BlogModel"        : [ ],
    "FeedbackModel"    : [ ],
    "BookingModel"     : [ ],
    "BookingTypeModel" : [ ],
}


interface AuthorizedRouteOptions {
    routeName: RouteNamesT,
    validators: string[]
}

const defaultSecurityFunctions: Record<RouteNamesT, RouteNamesT> = {
    getAll : "routeSecurityFunctions.userIsAdminOrOwnsResourceFilters",
    getOne : "routeSecurityFunctions.userIsAdminOrOwnsResource",
    create : "routeSecurityFunctions.userIsAdminOrOwnsResource",
    update : "routeSecurityFunctions.userIsAdminOrOwnsResource",
    delete : "routeSecurityFunctions.userIsAdminOrOwnsResource",
}

const publicSecurityFunctions: Record<RouteNamesT, RouteNamesT> = {
    getAll : "async ( ..._args: unknown[] ) => { await Promise.resolve() }",
    getOne : "async ( ..._args: unknown[] ) => { await Promise.resolve() }",
    create : "routeSecurityFunctions.userIsAdminOrOwnsResource",
    update : "routeSecurityFunctions.userIsAdminOrOwnsResource",
    delete : "routeSecurityFunctions.userIsAdminOrOwnsResource",
}

/** Authorization securitu functions validators to be placed inside each route */
const securityFunctions: Record<AllModelNamesT, typeof defaultSecurityFunctions> = {
    "RoleModel" : defaultSecurityFunctions,
    "UserModel" : {
        ...defaultSecurityFunctions,
        ...{
            getAll: `( authService: AuthService, request: ExpressRequest | undefined ) =>
        routeSecurityFunctions.adminOrFilters( authService, request, { isStaff: true } )`,
            getOne: `async ( authService: AuthService, request: ExpressRequest | undefined, modelObject: Model | object ) => {
        await routeSecurityFunctions.adminOrHasProperty( authService, request, modelObject, { isStaff: true } )?.catch(
            async ( e: unknown ) => {
                if ( e instanceof AuthError )
                    await routeSecurityFunctions.userIsAdminOrOwnsResource( authService, request, modelObject )
                else throw e
            }
        )
    }`,
        }
    },
    "TagModel"  : defaultSecurityFunctions,
    "BlogModel" : {
        ...publicSecurityFunctions,
        ...{
            getAll: `( authService: AuthService, request: ExpressRequest | undefined ) =>
        routeSecurityFunctions.adminOrFilters( authService, request, { isPublished: true } )`,
            getOne: `async ( authService: AuthService, request: ExpressRequest | undefined, modelObject: Model | object ) => {
        await routeSecurityFunctions.adminOrHasProperty( authService, request, modelObject, { isPublished: true } )
    }`,
        }
    },
    "FeedbackModel": {
        ...defaultSecurityFunctions,
        ...{
            getAll: `( authService: AuthService, request: ExpressRequest | undefined ) =>
        routeSecurityFunctions.adminOrFilters( authService, request, { isPublic: true } )`,
            getOne: `async ( authService: AuthService, request: ExpressRequest | undefined, modelObject: Model | object ) => {
        try {
            // Public feedback
            await routeSecurityFunctions.adminOrHasProperty( authService, request, modelObject, { isPublic: true } )
        } catch ( e: unknown ) {
            if ( !( e instanceof AuthError ) ) throw e
            try {
                // Allow viewing anonymous feedback after creation
                await routeSecurityFunctions.adminOrHasProperty( authService, request, modelObject, { userId: null } )
            } catch ( e: unknown ) {
                if ( !( e instanceof AuthError ) ) throw e
                // Users own unapproved feedback
                await routeSecurityFunctions.userIsAdminOrOwnsResource( authService, request, modelObject )
            }
        }
    }`,
            create: "routeSecurityFunctions.alwaysAllow"
        }
    }
    ,
    "BookingModel"     : defaultSecurityFunctions,
    "BookingTypeModel" : defaultSecurityFunctions,
}


/** Type for custom replacer function that takes in the file contents and returns an updated one */
type ReplacerFunction = ( fileContents: string ) => string


/** Any custom replacement functions for the controller files */
const controllerCustomReplacers: Record<AllModelNamesT, ReplacerFunction[]> = {
    "RoleModel" : [],
    "UserModel" : [
        ( contents: string ) => contents.replace( "await sqUser.update( user )", "await this.authService.updateUser( sqUser, user )" )
    ],
    "TagModel"         : [],
    "BlogModel"        : [],
    "FeedbackModel"    : [],
    "BookingModel"     : [],
    "BookingTypeModel" : [],
}


const generateControllers = async (
    controllersOutputDir: string,
    controllerTemplateFilePath: string,
    doShutdownDB = true
): Promise<void> => {
    console.log( "Generating controllers..." )

    await connectDB()

    const controllerTemplateFileContents = fs.readFileSync( controllerTemplateFilePath )

    const controllerTemplateName = controllerTemplateFileContents
        .toString()
        .split( "extends Controller {" )[ 0 ]
        .split( "export class" )[ 1 ]
        .trim()
        .replace( "Controller", "" )

    const [ first, ...rest ] = controllerTemplateName
    const camelCaseControllerTemplateName = first.toLowerCase() + rest.join( "" )

    for ( const model of allModels ) {
        const modelName = ( model as ModelStatic ).modelDefinition.modelName
        const newControllerName = modelName.replace( "Model", "" )

        const [ first, ...rest ] = newControllerName
        const camelCaseNewControllerName = first.toLowerCase() + rest.join( "" )

        // if ( newControllerName === controllerTemplateName )
        //     continue

        console.log( `Generating controller for ${modelName}` )

        // Update the key options
        const modelPropKeyOptions = propertyKeyOptions[ modelName ]

        const keyOptsToArrayStr = ( keyProps: string[] ) =>
            ( keyProps.length ? " " : "" ) + keyProps.map( v => `"${v}"` ).join( ", " ) + ( keyProps.length ? "," : "" )
        const keyOptsToLiteralStr = ( keyProps: string[] ) =>
            ( keyProps.length ? ", " : ", never" ) + keyProps.map( v => `"${v}"` ).join( " | " )


        const newControllerFileContents  =
        // Remove any routes and their typing
        [ modelName ].reduce(
            ( contents, modelName ) => {
                // Change the model name
                contents = contents.replaceAll( controllerTemplateName, newControllerName )
                    .replaceAll( camelCaseControllerTemplateName, camelCaseNewControllerName )
                    .replaceAll( controllerTemplateName.toLowerCase(), newControllerName.toLowerCase() )

                removedRoutes[ modelName ].forEach( routeName => {
                    contents = contents
                        .replace(
                            new RegExp( `\n    \\/\\* route-start: ${routeName} \\*\\/(.*?)\\    /\\* route-end: ${routeName} \\*\\/\n`, "gs" ), ""
                        )
                        .replace( new RegExp( `\\/\\* types-start: ${routeName} \\*\\/(.*?)\\/\\* types-end: ${routeName} \\*\\/\n\n`, "gs" ), "" )
                        .replace( new RegExp( `    ${newControllerName}${routesToOperations[ routeName ]}Response,[\n]?[\n]?` ), "" )
                        .replace( new RegExp( `    ${newControllerName}${routesToOperations[ routeName ]}Request,[\n]?[\n]?` ), "" )

                } )

                securedRoutes[ modelName ]
                    .forEach( ( { routeName, scopes } ) => {
                        const securityDecorators = makeSecurityDecorators( scopes )
                        // if ( modelName === "UserModel" )
                        //     console.log( "XX", modelName, routeName, securityDecorators )
                        contents = contents.replace( `/* route-securities: ${routeName} */`, securityDecorators )
                    } )

                routeAuthorizations[ modelName ]
                    .forEach( ( { routeName, validators } ) => {
                        const authDecorators = makeAuthorizationMiddlewareDecorators( validators )
                        contents = contents.replace( `/* route-authorizations: ${routeName} */`, authDecorators )
                    } )


                // Any that were not processed
                allRouteNames.forEach( routeName => {
                    contents = contents.replace( `    /* route-securities: ${routeName} */\n`, "" )
                    contents = contents.replace( `    /* route-authorizations: ${routeName} */\n`, "" )
                } )

                controllerCustomReplacers[ modelName ]
                    .forEach( replacerFunc => {
                        contents = replacerFunc( contents )
                    } )


                const modelSecurityFunctions = securityFunctions[ modelName ]
                const modelSecurityFunctionsString = JSON.stringify( modelSecurityFunctions, undefined, 4 )
                    .replaceAll( "\\n", "\n" )
                    .replaceAll( "\\\"", "\"" )
                    .replaceAll( "\"", "" )
                    .replaceAll( "'", "\"" )
                    .replaceAll( "getAll:", modelSecurityFunctions.getAll.includes( "\n" ) ? "getAll:" : "getAll :" )
                    .replaceAll( "getOne:", modelSecurityFunctions.getOne.includes( "\n" ) ? "getOne:" : "getOne :" )
                    .replaceAll( "create:", modelSecurityFunctions.create.includes( "\n" ) ? "create:" : "create :" )
                    .replaceAll( "update:", modelSecurityFunctions.update.includes( "\n" ) ? "update:" : "update :" )
                    .replaceAll( "delete:", modelSecurityFunctions.delete.includes( "\n" ) ? "delete:" : "delete :" )


                contents = contents.replace(
                    new RegExp( "const securityFunctions = \\{(.*)\\userIsAdminOrOwnsResource\\,\\n}", "gms" ),
                    `const securityFunctions = ${modelSecurityFunctionsString}`
                )

                return contents
            },

            controllerTemplateFileContents.toString()
        )
            .replaceAll( /\/\* route-start: (.*?) \*\/\n {4}/g, "" )
            .replaceAll( / {4}\/\* route-end: (.*?) \*\/\n/g, "" )
            .replaceAll( /\/\* types-start: (.*?) \*\/\n/g, "" )
            .replaceAll( /\/\* types-end: (.*?) \*\/\n/g, "" )

            // Update the key options
            .replaceAll( "/*RESPONSE_IGNORED_READ*/", keyOptsToArrayStr( modelPropKeyOptions.responseIgnored.READ ) )
            .replaceAll( "/*RESPONSE_IGNORED_READ_LITERAL*/", keyOptsToLiteralStr( modelPropKeyOptions.responseIgnored.READ ) )
            .replaceAll( "/*RESPONSE_IGNORED_CREATE*/", keyOptsToArrayStr( modelPropKeyOptions.responseIgnored.CREATE ) )
            .replaceAll( "/*RESPONSE_IGNORED_CREATE_LITERAL*/", keyOptsToLiteralStr( modelPropKeyOptions.responseIgnored.CREATE ) )
            .replaceAll( "/*RESPONSE_IGNORED_UPDATE*/", keyOptsToArrayStr( modelPropKeyOptions.responseIgnored.UPDATE ) )
            .replaceAll( "/*RESPONSE_IGNORED_UPDATE_LITERAL*/", keyOptsToLiteralStr( modelPropKeyOptions.responseIgnored.UPDATE ) )

            .replaceAll( "/*RESPONSE_DELETED_READ*/", keyOptsToArrayStr( modelPropKeyOptions.responseDeleted.READ ) )
            .replaceAll( "/*RESPONSE_DELETED_READ_LITERAL*/",keyOptsToLiteralStr( modelPropKeyOptions.responseDeleted.READ ) )
            .replaceAll( "/*RESPONSE_DELETED_CREATE*/", keyOptsToArrayStr( modelPropKeyOptions.responseDeleted.CREATE ) )
            .replaceAll( "/*RESPONSE_DELETED_CREATE_LITERAL*/",keyOptsToLiteralStr( modelPropKeyOptions.responseDeleted.CREATE ) )
            .replaceAll( "/*RESPONSE_DELETED_UPDATE*/", keyOptsToArrayStr( modelPropKeyOptions.responseDeleted.UPDATE ) )
            .replaceAll( "/*RESPONSE_DELETED_UPDATE_LITERAL*/",keyOptsToLiteralStr( modelPropKeyOptions.responseDeleted.UPDATE ) )

            .replaceAll( "/*RESPONSE_OPTIONAL_READ_LITERAL*/", keyOptsToLiteralStr( modelPropKeyOptions.responseOptional.READ ) )
            .replaceAll( "/*RESPONSE_OPTIONAL_CREATE_LITERAL*/", keyOptsToLiteralStr( modelPropKeyOptions.responseOptional.CREATE ) )
            .replaceAll( "/*RESPONSE_OPTIONAL_UPDATE_LITERAL*/", keyOptsToLiteralStr( modelPropKeyOptions.responseOptional.UPDATE ) )

            .replaceAll( "/*REQUEST_IGNORED_CREATE*/", keyOptsToArrayStr( modelPropKeyOptions.requestIgnored.CREATE ) )
            .replaceAll( "/*REQUEST_IGNORED_CREATE_LITERAL*/",keyOptsToLiteralStr( modelPropKeyOptions.requestIgnored.CREATE ) )
            .replaceAll( "/*REQUEST_IGNORED_UPDATE*/",keyOptsToArrayStr( modelPropKeyOptions.requestIgnored.UPDATE ) )
            .replaceAll( "/*REQUEST_IGNORED_UPDATE_LITERAL*/", keyOptsToLiteralStr( modelPropKeyOptions.requestIgnored.UPDATE ) )

            .replaceAll( "/*REQUEST_DELETED_CREATE*/", keyOptsToArrayStr( modelPropKeyOptions.requestDeleted.CREATE ) )
            .replaceAll( "/*REQUEST_DELETED_CREATE_LITERAL*/", keyOptsToLiteralStr( modelPropKeyOptions.requestDeleted.CREATE ) )
            .replaceAll( "/*REQUEST_DELETED_UPDATE*/", keyOptsToArrayStr( modelPropKeyOptions.requestDeleted.UPDATE ) )
            .replaceAll( "/*REQUEST_DELETED_UPDATE_LITERAL*/",keyOptsToLiteralStr( modelPropKeyOptions.requestDeleted.UPDATE ) )

            .replaceAll( "/*REQUEST_OPTIONAL_CREATE_LITERAL*/", keyOptsToLiteralStr( modelPropKeyOptions.requestOptional.CREATE ) )
            .replaceAll( "/*REQUEST_OPTIONAL_UPDATE_LITERAL*/", keyOptsToLiteralStr( modelPropKeyOptions.requestOptional.UPDATE ) )




        // Update imports for the subdir
            .replaceAll( "from \"../", "from \"../../" )
            .replaceAll( "from \"./", "from \"../" )


        if ( !fs.existsSync( controllersOutputDir ) )
            fs.mkdirSync( controllersOutputDir )

        const controllerOutputPath = path.join( controllersOutputDir, `${camelCaseNewControllerName}Controller.ts` )

        fs.writeFileSync( controllerOutputPath, newControllerFileContents )

        console.log( `Controller saved to ${controllerOutputPath}` )
    }

    console.log( "Linting generated controllers" )
    // const eslintOptions: ESLint.Options = {
    //     fix    : true,
    //     ignore : false,
    // }
    // const eslint = new ESLint( eslintOptions )
    // const results = await eslint.lintFiles( [ `${controllersOutputDir}/*.ts` ] )
    // await ESLint.outputFixes( results )

    if ( doShutdownDB ) await shutdownDB()

    console.log( "Controller generation complete." )

}


const generateControllersDefaults = async ( doShutdownDB = false ): Promise<void> => {
    await generateControllers(
        path.join( appRoot, "src/controllers/generated" ),
        path.join( appRoot, "src/controllers/template-controller.ts" ),
        doShutdownDB
    )
}

const appRoot = getAppRoot( import.meta.dirname )
const isRunDirectly = import.meta.filename.includes( process.argv[ 1 ] )
if ( isRunDirectly )
    await generateControllersDefaults( true )



export { generateControllers, generateControllersDefaults }