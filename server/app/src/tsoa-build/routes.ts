

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { fetchMiddlewares, ExpressTemplateService } from "@tsoa/runtime"
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UserController } from "./../controllers/generated/userController.js"
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AuthController } from "./../controllers/authController.js"
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TagController } from "./../controllers/generated/tagController.js"
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { RoleController } from "./../controllers/generated/roleController.js"
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { FeedbackController } from "./../controllers/generated/feedbackController.js"
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { BookingTypeController } from "./../controllers/generated/bookingTypeController.js"
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { BookingController } from "./../controllers/generated/bookingController.js"
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { BlogController } from "./../controllers/generated/blogController.js"
import { expressAuthentication } from "./../auth/authMiddleware.js"
// @ts-ignore - no great way to install types from subpackage
import { iocContainer } from "./../controllers/ioc/inversifyContainer.js"
import type { IocContainer, IocContainerFactory , TsoaRoute } from "@tsoa/runtime"
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from "express"

const expressAuthenticationRecasted = expressAuthentication as ( req: ExRequest, securityName: string, scopes?: string[], res?: ExResponse ) => Promise<any>


// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "AuthErrorTypes": {
        "dataType" : "refEnum",
        "enums"    : [ "Not Authenticated","Not Authorized","Security Failure" ],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AuthErrorResponseContent": {
        "dataType"   : "refObject",
        "properties" : {
            "message" : { "ref": "AuthErrorTypes","required": true },
            "details" : { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AuthErrorBodyMessageT": {
        "dataType" : "refAlias",
        "type"     : { "dataType": "enum","enums": [ "Auth Error" ],"validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ErrorResponseBody_AuthErrorResponseContent.AuthErrorBodyMessageT_": {
        "dataType"   : "refObject",
        "properties" : {
            "errors"  : { "dataType": "array","array": { "dataType": "refObject","ref": "AuthErrorResponseContent" },"required": true },
            "message" : { "ref": "AuthErrorBodyMessageT","required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AuthErrorResponseBody": {
        "dataType" : "refAlias",
        "type"     : { "ref": "ErrorResponseBody_AuthErrorResponseContent.AuthErrorBodyMessageT_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ValidationError": {
        "dataType"   : "refObject",
        "properties" : {
            "target"      : { "dataType": "object" },
            "property"    : { "dataType": "string","required": true },
            "value"       : { "dataType": "any" },
            "constraints" : { "dataType": "nestedObjectLiteral","nestedProperties": {},"additionalProperties": { "dataType": "string" } },
            "children"    : { "dataType": "array","array": { "dataType": "refObject","ref": "ValidationError" } },
            "contexts"    : { "dataType": "nestedObjectLiteral","nestedProperties": {},"additionalProperties": { "dataType": "any" } },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "FieldErrors": {
        "dataType"   : "refObject",
        "properties" : {
        },
        "additionalProperties": { "dataType": "nestedObjectLiteral","nestedProperties": { "value": { "dataType": "any" },"message": { "dataType": "string","required": true } } },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_ValidationErrorItem.Exclude_keyofValidationErrorItem.instance__": {
        "dataType" : "refAlias",
        "type"     : { "dataType": "nestedObjectLiteral","nestedProperties": { "type": { "dataType": "union","subSchemas": [ { "dataType": "enum","enums": [ "notNull violation" ] },{ "dataType": "enum","enums": [ "unique violation" ] },{ "dataType": "enum","enums": [ "Validation error" ] },{ "dataType": "enum","enums": [ null ] } ],"required": true },"path": { "dataType": "union","subSchemas": [ { "dataType": "string" },{ "dataType": "enum","enums": [ null ] } ],"required": true },"value": { "dataType": "any","required": true },"origin": { "dataType": "union","subSchemas": [ { "dataType": "enum","enums": [ "CORE" ] },{ "dataType": "enum","enums": [ "DB" ] },{ "dataType": "enum","enums": [ "FUNCTION" ] },{ "dataType": "enum","enums": [ "DATATYPE" ] },{ "dataType": "enum","enums": [ null ] } ],"required": true },"validatorKey": { "dataType": "union","subSchemas": [ { "dataType": "string" },{ "dataType": "enum","enums": [ null ] } ],"required": true },"validatorName": { "dataType": "union","subSchemas": [ { "dataType": "string" },{ "dataType": "enum","enums": [ null ] } ],"required": true },"validatorArgs": { "dataType": "array","array": { "dataType": "any" },"required": true },"name": { "dataType": "string","required": true },"message": { "dataType": "string","required": true },"stack": { "dataType": "union","subSchemas": [ { "dataType": "string" },{ "dataType": "undefined" } ] },"cause": { "dataType": "any" } },"validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_ValidationErrorItem.instance_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Pick_ValidationErrorItem.Exclude_keyofValidationErrorItem.instance__","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ValidationErrorDetailsTypes": {
        "dataType" : "refAlias",
        "type"     : { "dataType": "union","subSchemas": [ { "dataType": "array","array": { "dataType": "refObject","ref": "ValidationError" } },{ "ref": "FieldErrors" },{ "dataType": "array","array": { "dataType": "refAlias","ref": "Omit_ValidationErrorItem.instance_" } } ],"validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ValidationErrorResponseContent": {
        "dataType"   : "refObject",
        "properties" : {
            "details"         : { "dataType": "string","required": true },
            "message"         : { "dataType": "string","required": true },
            "expandedDetails" : { "ref": "ValidationErrorDetailsTypes" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ValidationErrorMessageT": {
        "dataType" : "refAlias",
        "type"     : { "dataType": "enum","enums": [ "Validation Failed" ],"validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ErrorResponseBody_ValidationErrorResponseContent.ValidationErrorMessageT_": {
        "dataType"   : "refObject",
        "properties" : {
            "errors"  : { "dataType": "array","array": { "dataType": "refObject","ref": "ValidationErrorResponseContent" },"required": true },
            "message" : { "ref": "ValidationErrorMessageT","required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ValidationErrorResponseBody": {
        "dataType" : "refAlias",
        "type"     : { "ref": "ErrorResponseBody_ValidationErrorResponseContent.ValidationErrorMessageT_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_any.Exclude_keyofany.Extract_password-or-ReadResponseContentOmittedKeysT.keyofUserModelDTO___": {
        "dataType" : "refAlias",
        "type"     : { "dataType": "nestedObjectLiteral","nestedProperties": { "updatedAt": { "dataType": "union","subSchemas": [ { "dataType": "datetime" },{ "dataType": "undefined" } ],"required": true },"firstName": { "dataType": "string","required": true },"lastName": { "dataType": "string","required": true },"email": { "dataType": "string","required": true },"profileImageURL": { "dataType": "union","subSchemas": [ { "dataType": "string" },{ "dataType": "undefined" } ] },"profileText": { "dataType": "union","subSchemas": [ { "dataType": "string" },{ "dataType": "undefined" } ] },"fullName": { "dataType": "union","subSchemas": [ { "dataType": "string" },{ "dataType": "undefined" } ] },"isAdmin": { "dataType": "union","subSchemas": [ { "dataType": "boolean" },{ "dataType": "undefined" } ] },"isStaff": { "dataType": "union","subSchemas": [ { "dataType": "boolean" },{ "dataType": "undefined" } ] },"id": { "dataType": "double","required": true },"createdAt": { "dataType": "datetime","required": true } },"validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_any.Extract_password-or-ReadResponseContentOmittedKeysT.keyofUserModelDTO__": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Pick_any.Exclude_keyofany.Extract_password-or-ReadResponseContentOmittedKeysT.keyofUserModelDTO___","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransformKeys_UserModelDTO.Extract_password-or-ReadResponseContentOmittedKeysT.keyofUserModelDTO_.Extract_never-or-ReadResponseContentOptionalKeysT.keyofUserModelDTO_.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Omit_any.Extract_password-or-ReadResponseContentOmittedKeysT.keyofUserModelDTO__","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReadResponseContent_UserModelDTO.password.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "TransformKeys_UserModelDTO.Extract_password-or-ReadResponseContentOmittedKeysT.keyofUserModelDTO_.Extract_never-or-ReadResponseContentOptionalKeysT.keyofUserModelDTO_.never_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "FoundResponseMessageT": {
        "dataType" : "refAlias",
        "type"     : { "dataType": "enum","enums": [ "Found" ],"validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MetaData_User_": {
        "dataType"   : "refObject",
        "properties" : {
            "dataType": { "dataType": "enum","enums": [ "User" ],"required": true },
        },
        "additionalProperties": { "dataType": "union","subSchemas": [ { "dataType": "object" },{ "dataType": "string" },{ "dataType": "double" },{ "dataType": "boolean" },{ "dataType": "enum","enums": [ null ] },{ "dataType": "undefined" } ] },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DataResponseBody_Array_ReadResponseContent_UserModelDTO.password.never__.User.FoundResponseMessageT_": {
        "dataType"   : "refObject",
        "properties" : {
            "data"     : { "dataType": "array","array": { "dataType": "refAlias","ref": "ReadResponseContent_UserModelDTO.password.never_" },"required": true },
            "message"  : { "ref": "FoundResponseMessageT","required": true },
            "metadata" : { "ref": "MetaData_User_" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserReadManyResponse": {
        "dataType" : "refAlias",
        "type"     : { "ref": "DataResponseBody_Array_ReadResponseContent_UserModelDTO.password.never__.User.FoundResponseMessageT_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "OrderByFieldValues": {
        "dataType" : "refEnum",
        "enums"    : [ "createdAt","updatedAt","-createdAt","-updatedAt" ],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "NotFoundDetailedMessageT": {
        "dataType" : "refAlias",
        "type"     : { "dataType": "string","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "NotFoundResponseContent": {
        "dataType"   : "refObject",
        "properties" : {
            "message": { "ref": "NotFoundDetailedMessageT","required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "NotFoundMessageT": {
        "dataType" : "refAlias",
        "type"     : { "dataType": "enum","enums": [ "Not Found" ],"validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ErrorResponseBody_NotFoundResponseContent.NotFoundMessageT_": {
        "dataType"   : "refObject",
        "properties" : {
            "errors"  : { "dataType": "array","array": { "dataType": "refObject","ref": "NotFoundResponseContent" },"required": true },
            "message" : { "ref": "NotFoundMessageT","required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "NotFoundResponseBody": {
        "dataType" : "refAlias",
        "type"     : { "ref": "ErrorResponseBody_NotFoundResponseContent.NotFoundMessageT_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserNotFoundResponseBody": {
        "dataType" : "refAlias",
        "type"     : { "ref": "NotFoundResponseBody","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DataResponseBody_ReadResponseContent_UserModelDTO.password.never_.User.FoundResponseMessageT_": {
        "dataType"   : "refObject",
        "properties" : {
            "data"     : { "ref": "ReadResponseContent_UserModelDTO.password.never_","required": true },
            "message"  : { "ref": "FoundResponseMessageT","required": true },
            "metadata" : { "ref": "MetaData_User_" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserReadResponse": {
        "dataType" : "refAlias",
        "type"     : { "ref": "DataResponseBody_ReadResponseContent_UserModelDTO.password.never_.User.FoundResponseMessageT_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AppModelIdT": {
        "dataType" : "refAlias",
        "type"     : { "dataType": "double","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_any.Exclude_keyofany.Extract_password-or-CreateResponseContentOmittedKeysT.keyofUserModelDTO___": {
        "dataType" : "refAlias",
        "type"     : { "dataType": "nestedObjectLiteral","nestedProperties": { "firstName": { "dataType": "string","required": true },"lastName": { "dataType": "string","required": true },"email": { "dataType": "string","required": true },"profileImageURL": { "dataType": "union","subSchemas": [ { "dataType": "string" },{ "dataType": "undefined" } ] },"profileText": { "dataType": "union","subSchemas": [ { "dataType": "string" },{ "dataType": "undefined" } ] },"fullName": { "dataType": "union","subSchemas": [ { "dataType": "string" },{ "dataType": "undefined" } ] },"isAdmin": { "dataType": "union","subSchemas": [ { "dataType": "boolean" },{ "dataType": "undefined" } ] },"isStaff": { "dataType": "union","subSchemas": [ { "dataType": "boolean" },{ "dataType": "undefined" } ] },"id": { "dataType": "double","required": true },"createdAt": { "dataType": "datetime","required": true } },"validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_any.Extract_password-or-CreateResponseContentOmittedKeysT.keyofUserModelDTO__": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Pick_any.Exclude_keyofany.Extract_password-or-CreateResponseContentOmittedKeysT.keyofUserModelDTO___","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransformKeys_UserModelDTO.Extract_password-or-CreateResponseContentOmittedKeysT.keyofUserModelDTO_.Extract_never-or-CreateResponseContentOptionalKeysT.keyofUserModelDTO_.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Omit_any.Extract_password-or-CreateResponseContentOmittedKeysT.keyofUserModelDTO__","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateResponseContent_UserModelDTO.password.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "TransformKeys_UserModelDTO.Extract_password-or-CreateResponseContentOmittedKeysT.keyofUserModelDTO_.Extract_never-or-CreateResponseContentOptionalKeysT.keyofUserModelDTO_.never_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreatedResponseMessageT": {
        "dataType" : "refAlias",
        "type"     : { "dataType": "enum","enums": [ "Created" ],"validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DataResponseBody_CreateResponseContent_UserModelDTO.password.never_.User.CreatedResponseMessageT_": {
        "dataType"   : "refObject",
        "properties" : {
            "data"     : { "ref": "CreateResponseContent_UserModelDTO.password.never_","required": true },
            "message"  : { "ref": "CreatedResponseMessageT","required": true },
            "metadata" : { "ref": "MetaData_User_" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserCreateResponse": {
        "dataType" : "refAlias",
        "type"     : { "ref": "DataResponseBody_CreateResponseContent_UserModelDTO.password.never_.User.CreatedResponseMessageT_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_any.Exclude_keyofany.Extract_isAdmin-or-isStaff-or-fullName-or-CreateRequestBodyOmittedKeysT.keyofUserModelDTO___": {
        "dataType" : "refAlias",
        "type"     : { "dataType": "nestedObjectLiteral","nestedProperties": { "password": { "dataType": "string","required": true },"firstName": { "dataType": "string","required": true },"lastName": { "dataType": "string","required": true },"email": { "dataType": "string","required": true },"profileImageURL": { "dataType": "union","subSchemas": [ { "dataType": "string" },{ "dataType": "undefined" } ] },"profileText": { "dataType": "union","subSchemas": [ { "dataType": "string" },{ "dataType": "undefined" } ] } },"validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_any.Extract_isAdmin-or-isStaff-or-fullName-or-CreateRequestBodyOmittedKeysT.keyofUserModelDTO__": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Pick_any.Exclude_keyofany.Extract_isAdmin-or-isStaff-or-fullName-or-CreateRequestBodyOmittedKeysT.keyofUserModelDTO___","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransformKeys_UserModelDTO.Extract_isAdmin-or-isStaff-or-fullName-or-CreateRequestBodyOmittedKeysT.keyofUserModelDTO_.profileImageURL.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Omit_any.Extract_isAdmin-or-isStaff-or-fullName-or-CreateRequestBodyOmittedKeysT.keyofUserModelDTO__","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateRequestBody_UserModelDTO.isAdmin-or-isStaff-or-fullName.profileImageURL_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "TransformKeys_UserModelDTO.Extract_isAdmin-or-isStaff-or-fullName-or-CreateRequestBodyOmittedKeysT.keyofUserModelDTO_.profileImageURL.never_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserCreateRequest": {
        "dataType" : "refAlias",
        "type"     : { "ref": "CreateRequestBody_UserModelDTO.isAdmin-or-isStaff-or-fullName.profileImageURL_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_any.Exclude_keyofany.Extract_password-or-UpdateResponseContentOmittedKeysT.keyofUserModelDTO___": {
        "dataType" : "refAlias",
        "type"     : { "dataType": "nestedObjectLiteral","nestedProperties": { "updatedAt": { "dataType": "datetime","required": true },"firstName": { "dataType": "string","required": true },"lastName": { "dataType": "string","required": true },"email": { "dataType": "string","required": true },"profileImageURL": { "dataType": "union","subSchemas": [ { "dataType": "string" },{ "dataType": "undefined" } ] },"profileText": { "dataType": "union","subSchemas": [ { "dataType": "string" },{ "dataType": "undefined" } ] },"fullName": { "dataType": "union","subSchemas": [ { "dataType": "string" },{ "dataType": "undefined" } ] },"isAdmin": { "dataType": "union","subSchemas": [ { "dataType": "boolean" },{ "dataType": "undefined" } ] },"isStaff": { "dataType": "union","subSchemas": [ { "dataType": "boolean" },{ "dataType": "undefined" } ] },"id": { "dataType": "double","required": true },"createdAt": { "dataType": "datetime","required": true } },"validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_any.Extract_password-or-UpdateResponseContentOmittedKeysT.keyofUserModelDTO__": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Pick_any.Exclude_keyofany.Extract_password-or-UpdateResponseContentOmittedKeysT.keyofUserModelDTO___","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransformKeys_UserModelDTO.Extract_password-or-UpdateResponseContentOmittedKeysT.keyofUserModelDTO_.never.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Omit_any.Extract_password-or-UpdateResponseContentOmittedKeysT.keyofUserModelDTO__","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateResponseContent_UserModelDTO.password.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "TransformKeys_UserModelDTO.Extract_password-or-UpdateResponseContentOmittedKeysT.keyofUserModelDTO_.never.never_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdatedResponseMessageT": {
        "dataType" : "refAlias",
        "type"     : { "dataType": "enum","enums": [ "Updated" ],"validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DataResponseBody_UpdateResponseContent_UserModelDTO.password.never_.User.UpdatedResponseMessageT_": {
        "dataType"   : "refObject",
        "properties" : {
            "data"     : { "ref": "UpdateResponseContent_UserModelDTO.password.never_","required": true },
            "message"  : { "ref": "UpdatedResponseMessageT","required": true },
            "metadata" : { "ref": "MetaData_User_" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserUpdateResponse": {
        "dataType" : "refAlias",
        "type"     : { "ref": "DataResponseBody_UpdateResponseContent_UserModelDTO.password.never_.User.UpdatedResponseMessageT_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_any.Exclude_keyofany.Extract_isAdmin-or-isStaff-or-fullName-or-UpdateRequestBodyOmittedKeysT.keyofUserModelDTO___": {
        "dataType" : "refAlias",
        "type"     : { "dataType": "nestedObjectLiteral","nestedProperties": { "password": { "dataType": "union","subSchemas": [ { "dataType": "string" },{ "dataType": "undefined" } ] },"firstName": { "dataType": "union","subSchemas": [ { "dataType": "string" },{ "dataType": "undefined" } ] },"lastName": { "dataType": "union","subSchemas": [ { "dataType": "string" },{ "dataType": "undefined" } ] },"email": { "dataType": "union","subSchemas": [ { "dataType": "string" },{ "dataType": "undefined" } ] },"profileImageURL": { "dataType": "union","subSchemas": [ { "dataType": "string" },{ "dataType": "undefined" } ] },"profileText": { "dataType": "union","subSchemas": [ { "dataType": "string" },{ "dataType": "undefined" } ] } },"validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_any.Extract_isAdmin-or-isStaff-or-fullName-or-UpdateRequestBodyOmittedKeysT.keyofUserModelDTO__": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Pick_any.Exclude_keyofany.Extract_isAdmin-or-isStaff-or-fullName-or-UpdateRequestBodyOmittedKeysT.keyofUserModelDTO___","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransformKeys_Partial_UserModelDTO_.Extract_isAdmin-or-isStaff-or-fullName-or-UpdateRequestBodyOmittedKeysT.keyofUserModelDTO_.profileText.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Omit_any.Extract_isAdmin-or-isStaff-or-fullName-or-UpdateRequestBodyOmittedKeysT.keyofUserModelDTO__","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateRequestBody_UserModelDTO.isAdmin-or-isStaff-or-fullName.profileText_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "TransformKeys_Partial_UserModelDTO_.Extract_isAdmin-or-isStaff-or-fullName-or-UpdateRequestBodyOmittedKeysT.keyofUserModelDTO_.profileText.never_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserUpdateRequest": {
        "dataType" : "refAlias",
        "type"     : { "ref": "UpdateRequestBody_UserModelDTO.isAdmin-or-isStaff-or-fullName.profileText_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DeletedResponseContent": {
        "dataType"   : "refObject",
        "properties" : {
            "id": { "dataType": "double","required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DeletedResponseMessageT": {
        "dataType" : "refAlias",
        "type"     : { "dataType": "enum","enums": [ "Deleted" ],"validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DataResponseBody_DeletedResponseContent.User.DeletedResponseMessageT_": {
        "dataType"   : "refObject",
        "properties" : {
            "data"     : { "ref": "DeletedResponseContent","required": true },
            "message"  : { "ref": "DeletedResponseMessageT","required": true },
            "metadata" : { "ref": "MetaData_User_" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DeleteResponseBody_User_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "DataResponseBody_DeletedResponseContent.User.DeletedResponseMessageT_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserDeleteResponse": {
        "dataType" : "refAlias",
        "type"     : { "ref": "DeleteResponseBody_User_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReadResponseContent_UserModelDTO.password_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "TransformKeys_UserModelDTO.Extract_password-or-ReadResponseContentOmittedKeysT.keyofUserModelDTO_.Extract_never-or-ReadResponseContentOptionalKeysT.keyofUserModelDTO_.never_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "OAuth2TokenResponseBody": {
        "dataType"   : "refObject",
        "properties" : {
            "access_token" : { "dataType": "string","required": true },
            "token_type"   : { "dataType": "union","subSchemas": [ { "dataType": "enum","enums": [ "Bearer" ] },{ "dataType": "enum","enums": [ "bearer" ] } ],"required": true },
            "expires_in"   : { "dataType": "union","subSchemas": [ { "dataType": "string" },{ "dataType": "double" } ],"required": true },
            "user"         : { "ref": "ReadResponseContent_UserModelDTO.password_","required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AuthLoginResponse": {
        "dataType" : "refAlias",
        "type"     : { "ref": "OAuth2TokenResponseBody","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_any.Exclude_keyofany.Extract_password-or-updatedAt-or-ReadResponseContentOmittedKeysT.keyofUserModelDTO___": {
        "dataType" : "refAlias",
        "type"     : { "dataType": "nestedObjectLiteral","nestedProperties": { "firstName": { "dataType": "string","required": true },"lastName": { "dataType": "string","required": true },"email": { "dataType": "string","required": true },"profileImageURL": { "dataType": "union","subSchemas": [ { "dataType": "string" },{ "dataType": "undefined" } ] },"profileText": { "dataType": "union","subSchemas": [ { "dataType": "string" },{ "dataType": "undefined" } ] },"fullName": { "dataType": "union","subSchemas": [ { "dataType": "string" },{ "dataType": "undefined" } ] },"isAdmin": { "dataType": "union","subSchemas": [ { "dataType": "boolean" },{ "dataType": "undefined" } ] },"isStaff": { "dataType": "union","subSchemas": [ { "dataType": "boolean" },{ "dataType": "undefined" } ] },"id": { "dataType": "double","required": true },"createdAt": { "dataType": "datetime","required": true } },"validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_any.Extract_password-or-updatedAt-or-ReadResponseContentOmittedKeysT.keyofUserModelDTO__": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Pick_any.Exclude_keyofany.Extract_password-or-updatedAt-or-ReadResponseContentOmittedKeysT.keyofUserModelDTO___","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransformKeys_UserModelDTO.Extract_password-or-updatedAt-or-ReadResponseContentOmittedKeysT.keyofUserModelDTO_.Extract_never-or-ReadResponseContentOptionalKeysT.keyofUserModelDTO_.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Omit_any.Extract_password-or-updatedAt-or-ReadResponseContentOmittedKeysT.keyofUserModelDTO__","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReadResponseContent_UserModelDTO.password-or-updatedAt_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "TransformKeys_UserModelDTO.Extract_password-or-updatedAt-or-ReadResponseContentOmittedKeysT.keyofUserModelDTO_.Extract_never-or-ReadResponseContentOptionalKeysT.keyofUserModelDTO_.never_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DataResponseBody_ReadResponseContent_UserModelDTO.password-or-updatedAt_.User.FoundResponseMessageT_": {
        "dataType"   : "refObject",
        "properties" : {
            "data"     : { "ref": "ReadResponseContent_UserModelDTO.password-or-updatedAt_","required": true },
            "message"  : { "ref": "FoundResponseMessageT","required": true },
            "metadata" : { "ref": "MetaData_User_" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AuthRegisterResponse": {
        "dataType" : "refAlias",
        "type"     : { "ref": "DataResponseBody_ReadResponseContent_UserModelDTO.password-or-updatedAt_.User.FoundResponseMessageT_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AuthRegisterRequestBody": {
        "dataType" : "refAlias",
        "type"     : { "ref": "CreateRequestBody_UserModelDTO.isAdmin-or-isStaff-or-fullName.profileImageURL_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_any.Exclude_keyofany.Extract_never-or-ReadResponseContentOmittedKeysT.keyofTagModelDTO___": {
        "dataType" : "refAlias",
        "type"     : { "dataType": "nestedObjectLiteral","nestedProperties": { "name": { "dataType": "string","required": true },"updatedAt": { "dataType": "union","subSchemas": [ { "dataType": "datetime" },{ "dataType": "undefined" } ],"required": true },"id": { "dataType": "double","required": true },"createdAt": { "dataType": "datetime","required": true },"cssColour": { "dataType": "string","required": true } },"validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_any.Extract_never-or-ReadResponseContentOmittedKeysT.keyofTagModelDTO__": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Pick_any.Exclude_keyofany.Extract_never-or-ReadResponseContentOmittedKeysT.keyofTagModelDTO___","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransformKeys_TagModelDTO.Extract_never-or-ReadResponseContentOmittedKeysT.keyofTagModelDTO_.Extract_never-or-ReadResponseContentOptionalKeysT.keyofTagModelDTO_.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Omit_any.Extract_never-or-ReadResponseContentOmittedKeysT.keyofTagModelDTO__","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReadResponseContent_TagModelDTO.never.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "TransformKeys_TagModelDTO.Extract_never-or-ReadResponseContentOmittedKeysT.keyofTagModelDTO_.Extract_never-or-ReadResponseContentOptionalKeysT.keyofTagModelDTO_.never_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MetaData_Tag_": {
        "dataType"   : "refObject",
        "properties" : {
            "dataType": { "dataType": "enum","enums": [ "Tag" ],"required": true },
        },
        "additionalProperties": { "dataType": "union","subSchemas": [ { "dataType": "object" },{ "dataType": "string" },{ "dataType": "double" },{ "dataType": "boolean" },{ "dataType": "enum","enums": [ null ] },{ "dataType": "undefined" } ] },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DataResponseBody_Array_ReadResponseContent_TagModelDTO.never.never__.Tag.FoundResponseMessageT_": {
        "dataType"   : "refObject",
        "properties" : {
            "data"     : { "dataType": "array","array": { "dataType": "refAlias","ref": "ReadResponseContent_TagModelDTO.never.never_" },"required": true },
            "message"  : { "ref": "FoundResponseMessageT","required": true },
            "metadata" : { "ref": "MetaData_Tag_" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TagReadManyResponse": {
        "dataType" : "refAlias",
        "type"     : { "ref": "DataResponseBody_Array_ReadResponseContent_TagModelDTO.never.never__.Tag.FoundResponseMessageT_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TagNotFoundResponseBody": {
        "dataType" : "refAlias",
        "type"     : { "ref": "NotFoundResponseBody","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DataResponseBody_ReadResponseContent_TagModelDTO.never.never_.Tag.FoundResponseMessageT_": {
        "dataType"   : "refObject",
        "properties" : {
            "data"     : { "ref": "ReadResponseContent_TagModelDTO.never.never_","required": true },
            "message"  : { "ref": "FoundResponseMessageT","required": true },
            "metadata" : { "ref": "MetaData_Tag_" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TagReadResponse": {
        "dataType" : "refAlias",
        "type"     : { "ref": "DataResponseBody_ReadResponseContent_TagModelDTO.never.never_.Tag.FoundResponseMessageT_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_any.Exclude_keyofany.Extract_never-or-CreateResponseContentOmittedKeysT.keyofTagModelDTO___": {
        "dataType" : "refAlias",
        "type"     : { "dataType": "nestedObjectLiteral","nestedProperties": { "name": { "dataType": "string","required": true },"id": { "dataType": "double","required": true },"createdAt": { "dataType": "datetime","required": true },"cssColour": { "dataType": "string","required": true } },"validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_any.Extract_never-or-CreateResponseContentOmittedKeysT.keyofTagModelDTO__": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Pick_any.Exclude_keyofany.Extract_never-or-CreateResponseContentOmittedKeysT.keyofTagModelDTO___","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransformKeys_TagModelDTO.Extract_never-or-CreateResponseContentOmittedKeysT.keyofTagModelDTO_.Extract_never-or-CreateResponseContentOptionalKeysT.keyofTagModelDTO_.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Omit_any.Extract_never-or-CreateResponseContentOmittedKeysT.keyofTagModelDTO__","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateResponseContent_TagModelDTO.never.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "TransformKeys_TagModelDTO.Extract_never-or-CreateResponseContentOmittedKeysT.keyofTagModelDTO_.Extract_never-or-CreateResponseContentOptionalKeysT.keyofTagModelDTO_.never_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DataResponseBody_CreateResponseContent_TagModelDTO.never.never_.Tag.CreatedResponseMessageT_": {
        "dataType"   : "refObject",
        "properties" : {
            "data"     : { "ref": "CreateResponseContent_TagModelDTO.never.never_","required": true },
            "message"  : { "ref": "CreatedResponseMessageT","required": true },
            "metadata" : { "ref": "MetaData_Tag_" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TagCreateResponse": {
        "dataType" : "refAlias",
        "type"     : { "ref": "DataResponseBody_CreateResponseContent_TagModelDTO.never.never_.Tag.CreatedResponseMessageT_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_any.Exclude_keyofany.Extract_never-or-CreateRequestBodyOmittedKeysT.keyofTagModelDTO___": {
        "dataType" : "refAlias",
        "type"     : { "dataType": "nestedObjectLiteral","nestedProperties": { "name": { "dataType": "string","required": true },"cssColour": { "dataType": "string","required": true } },"validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_any.Extract_never-or-CreateRequestBodyOmittedKeysT.keyofTagModelDTO__": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Pick_any.Exclude_keyofany.Extract_never-or-CreateRequestBodyOmittedKeysT.keyofTagModelDTO___","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransformKeys_TagModelDTO.Extract_never-or-CreateRequestBodyOmittedKeysT.keyofTagModelDTO_.never.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Omit_any.Extract_never-or-CreateRequestBodyOmittedKeysT.keyofTagModelDTO__","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateRequestBody_TagModelDTO.never.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "TransformKeys_TagModelDTO.Extract_never-or-CreateRequestBodyOmittedKeysT.keyofTagModelDTO_.never.never_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TagCreateRequest": {
        "dataType" : "refAlias",
        "type"     : { "ref": "CreateRequestBody_TagModelDTO.never.never_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_any.Exclude_keyofany.Extract_never-or-UpdateResponseContentOmittedKeysT.keyofTagModelDTO___": {
        "dataType" : "refAlias",
        "type"     : { "dataType": "nestedObjectLiteral","nestedProperties": { "name": { "dataType": "string","required": true },"updatedAt": { "dataType": "datetime","required": true },"id": { "dataType": "double","required": true },"createdAt": { "dataType": "datetime","required": true },"cssColour": { "dataType": "string","required": true } },"validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_any.Extract_never-or-UpdateResponseContentOmittedKeysT.keyofTagModelDTO__": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Pick_any.Exclude_keyofany.Extract_never-or-UpdateResponseContentOmittedKeysT.keyofTagModelDTO___","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransformKeys_TagModelDTO.Extract_never-or-UpdateResponseContentOmittedKeysT.keyofTagModelDTO_.never.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Omit_any.Extract_never-or-UpdateResponseContentOmittedKeysT.keyofTagModelDTO__","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateResponseContent_TagModelDTO.never.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "TransformKeys_TagModelDTO.Extract_never-or-UpdateResponseContentOmittedKeysT.keyofTagModelDTO_.never.never_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DataResponseBody_UpdateResponseContent_TagModelDTO.never.never_.Tag.UpdatedResponseMessageT_": {
        "dataType"   : "refObject",
        "properties" : {
            "data"     : { "ref": "UpdateResponseContent_TagModelDTO.never.never_","required": true },
            "message"  : { "ref": "UpdatedResponseMessageT","required": true },
            "metadata" : { "ref": "MetaData_Tag_" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TagUpdateResponse": {
        "dataType" : "refAlias",
        "type"     : { "ref": "DataResponseBody_UpdateResponseContent_TagModelDTO.never.never_.Tag.UpdatedResponseMessageT_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_any.Exclude_keyofany.Extract_never-or-UpdateRequestBodyOmittedKeysT.keyofTagModelDTO___": {
        "dataType" : "refAlias",
        "type"     : { "dataType": "nestedObjectLiteral","nestedProperties": { "name": { "dataType": "union","subSchemas": [ { "dataType": "string" },{ "dataType": "undefined" } ] },"cssColour": { "dataType": "union","subSchemas": [ { "dataType": "string" },{ "dataType": "undefined" } ] } },"validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_any.Extract_never-or-UpdateRequestBodyOmittedKeysT.keyofTagModelDTO__": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Pick_any.Exclude_keyofany.Extract_never-or-UpdateRequestBodyOmittedKeysT.keyofTagModelDTO___","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransformKeys_Partial_TagModelDTO_.Extract_never-or-UpdateRequestBodyOmittedKeysT.keyofTagModelDTO_.never.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Omit_any.Extract_never-or-UpdateRequestBodyOmittedKeysT.keyofTagModelDTO__","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateRequestBody_TagModelDTO.never.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "TransformKeys_Partial_TagModelDTO_.Extract_never-or-UpdateRequestBodyOmittedKeysT.keyofTagModelDTO_.never.never_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TagUpdateRequest": {
        "dataType" : "refAlias",
        "type"     : { "ref": "UpdateRequestBody_TagModelDTO.never.never_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DataResponseBody_DeletedResponseContent.Tag.DeletedResponseMessageT_": {
        "dataType"   : "refObject",
        "properties" : {
            "data"     : { "ref": "DeletedResponseContent","required": true },
            "message"  : { "ref": "DeletedResponseMessageT","required": true },
            "metadata" : { "ref": "MetaData_Tag_" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DeleteResponseBody_Tag_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "DataResponseBody_DeletedResponseContent.Tag.DeletedResponseMessageT_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TagDeleteResponse": {
        "dataType" : "refAlias",
        "type"     : { "ref": "DeleteResponseBody_Tag_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_any.Exclude_keyofany.Extract_never-or-ReadResponseContentOmittedKeysT.keyofRoleModelDTO___": {
        "dataType" : "refAlias",
        "type"     : { "dataType": "nestedObjectLiteral","nestedProperties": { "name": { "dataType": "string","required": true },"updatedAt": { "dataType": "union","subSchemas": [ { "dataType": "datetime" },{ "dataType": "undefined" } ],"required": true },"id": { "dataType": "double","required": true },"createdAt": { "dataType": "datetime","required": true } },"validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_any.Extract_never-or-ReadResponseContentOmittedKeysT.keyofRoleModelDTO__": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Pick_any.Exclude_keyofany.Extract_never-or-ReadResponseContentOmittedKeysT.keyofRoleModelDTO___","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransformKeys_RoleModelDTO.Extract_never-or-ReadResponseContentOmittedKeysT.keyofRoleModelDTO_.Extract_never-or-ReadResponseContentOptionalKeysT.keyofRoleModelDTO_.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Omit_any.Extract_never-or-ReadResponseContentOmittedKeysT.keyofRoleModelDTO__","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReadResponseContent_RoleModelDTO.never.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "TransformKeys_RoleModelDTO.Extract_never-or-ReadResponseContentOmittedKeysT.keyofRoleModelDTO_.Extract_never-or-ReadResponseContentOptionalKeysT.keyofRoleModelDTO_.never_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MetaData_Role_": {
        "dataType"   : "refObject",
        "properties" : {
            "dataType": { "dataType": "enum","enums": [ "Role" ],"required": true },
        },
        "additionalProperties": { "dataType": "union","subSchemas": [ { "dataType": "object" },{ "dataType": "string" },{ "dataType": "double" },{ "dataType": "boolean" },{ "dataType": "enum","enums": [ null ] },{ "dataType": "undefined" } ] },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DataResponseBody_Array_ReadResponseContent_RoleModelDTO.never.never__.Role.FoundResponseMessageT_": {
        "dataType"   : "refObject",
        "properties" : {
            "data"     : { "dataType": "array","array": { "dataType": "refAlias","ref": "ReadResponseContent_RoleModelDTO.never.never_" },"required": true },
            "message"  : { "ref": "FoundResponseMessageT","required": true },
            "metadata" : { "ref": "MetaData_Role_" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RoleReadManyResponse": {
        "dataType" : "refAlias",
        "type"     : { "ref": "DataResponseBody_Array_ReadResponseContent_RoleModelDTO.never.never__.Role.FoundResponseMessageT_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RoleNotFoundResponseBody": {
        "dataType" : "refAlias",
        "type"     : { "ref": "NotFoundResponseBody","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DataResponseBody_ReadResponseContent_RoleModelDTO.never.never_.Role.FoundResponseMessageT_": {
        "dataType"   : "refObject",
        "properties" : {
            "data"     : { "ref": "ReadResponseContent_RoleModelDTO.never.never_","required": true },
            "message"  : { "ref": "FoundResponseMessageT","required": true },
            "metadata" : { "ref": "MetaData_Role_" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RoleReadResponse": {
        "dataType" : "refAlias",
        "type"     : { "ref": "DataResponseBody_ReadResponseContent_RoleModelDTO.never.never_.Role.FoundResponseMessageT_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_any.Exclude_keyofany.Extract_never-or-CreateResponseContentOmittedKeysT.keyofRoleModelDTO___": {
        "dataType" : "refAlias",
        "type"     : { "dataType": "nestedObjectLiteral","nestedProperties": { "name": { "dataType": "string","required": true },"id": { "dataType": "double","required": true },"createdAt": { "dataType": "datetime","required": true } },"validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_any.Extract_never-or-CreateResponseContentOmittedKeysT.keyofRoleModelDTO__": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Pick_any.Exclude_keyofany.Extract_never-or-CreateResponseContentOmittedKeysT.keyofRoleModelDTO___","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransformKeys_RoleModelDTO.Extract_never-or-CreateResponseContentOmittedKeysT.keyofRoleModelDTO_.Extract_never-or-CreateResponseContentOptionalKeysT.keyofRoleModelDTO_.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Omit_any.Extract_never-or-CreateResponseContentOmittedKeysT.keyofRoleModelDTO__","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateResponseContent_RoleModelDTO.never.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "TransformKeys_RoleModelDTO.Extract_never-or-CreateResponseContentOmittedKeysT.keyofRoleModelDTO_.Extract_never-or-CreateResponseContentOptionalKeysT.keyofRoleModelDTO_.never_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DataResponseBody_CreateResponseContent_RoleModelDTO.never.never_.Role.CreatedResponseMessageT_": {
        "dataType"   : "refObject",
        "properties" : {
            "data"     : { "ref": "CreateResponseContent_RoleModelDTO.never.never_","required": true },
            "message"  : { "ref": "CreatedResponseMessageT","required": true },
            "metadata" : { "ref": "MetaData_Role_" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RoleCreateResponse": {
        "dataType" : "refAlias",
        "type"     : { "ref": "DataResponseBody_CreateResponseContent_RoleModelDTO.never.never_.Role.CreatedResponseMessageT_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_any.Exclude_keyofany.Extract_never-or-CreateRequestBodyOmittedKeysT.keyofRoleModelDTO___": {
        "dataType" : "refAlias",
        "type"     : { "dataType": "nestedObjectLiteral","nestedProperties": { "name": { "dataType": "string","required": true } },"validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_any.Extract_never-or-CreateRequestBodyOmittedKeysT.keyofRoleModelDTO__": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Pick_any.Exclude_keyofany.Extract_never-or-CreateRequestBodyOmittedKeysT.keyofRoleModelDTO___","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransformKeys_RoleModelDTO.Extract_never-or-CreateRequestBodyOmittedKeysT.keyofRoleModelDTO_.never.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Omit_any.Extract_never-or-CreateRequestBodyOmittedKeysT.keyofRoleModelDTO__","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateRequestBody_RoleModelDTO.never.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "TransformKeys_RoleModelDTO.Extract_never-or-CreateRequestBodyOmittedKeysT.keyofRoleModelDTO_.never.never_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RoleCreateRequest": {
        "dataType" : "refAlias",
        "type"     : { "ref": "CreateRequestBody_RoleModelDTO.never.never_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_any.Exclude_keyofany.Extract_never-or-UpdateResponseContentOmittedKeysT.keyofRoleModelDTO___": {
        "dataType" : "refAlias",
        "type"     : { "dataType": "nestedObjectLiteral","nestedProperties": { "name": { "dataType": "string","required": true },"updatedAt": { "dataType": "datetime","required": true },"id": { "dataType": "double","required": true },"createdAt": { "dataType": "datetime","required": true } },"validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_any.Extract_never-or-UpdateResponseContentOmittedKeysT.keyofRoleModelDTO__": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Pick_any.Exclude_keyofany.Extract_never-or-UpdateResponseContentOmittedKeysT.keyofRoleModelDTO___","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransformKeys_RoleModelDTO.Extract_never-or-UpdateResponseContentOmittedKeysT.keyofRoleModelDTO_.never.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Omit_any.Extract_never-or-UpdateResponseContentOmittedKeysT.keyofRoleModelDTO__","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateResponseContent_RoleModelDTO.never.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "TransformKeys_RoleModelDTO.Extract_never-or-UpdateResponseContentOmittedKeysT.keyofRoleModelDTO_.never.never_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DataResponseBody_UpdateResponseContent_RoleModelDTO.never.never_.Role.UpdatedResponseMessageT_": {
        "dataType"   : "refObject",
        "properties" : {
            "data"     : { "ref": "UpdateResponseContent_RoleModelDTO.never.never_","required": true },
            "message"  : { "ref": "UpdatedResponseMessageT","required": true },
            "metadata" : { "ref": "MetaData_Role_" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RoleUpdateResponse": {
        "dataType" : "refAlias",
        "type"     : { "ref": "DataResponseBody_UpdateResponseContent_RoleModelDTO.never.never_.Role.UpdatedResponseMessageT_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_any.Exclude_keyofany.Extract_never-or-UpdateRequestBodyOmittedKeysT.keyofRoleModelDTO___": {
        "dataType" : "refAlias",
        "type"     : { "dataType": "nestedObjectLiteral","nestedProperties": { "name": { "dataType": "union","subSchemas": [ { "dataType": "string" },{ "dataType": "undefined" } ] } },"validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_any.Extract_never-or-UpdateRequestBodyOmittedKeysT.keyofRoleModelDTO__": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Pick_any.Exclude_keyofany.Extract_never-or-UpdateRequestBodyOmittedKeysT.keyofRoleModelDTO___","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransformKeys_Partial_RoleModelDTO_.Extract_never-or-UpdateRequestBodyOmittedKeysT.keyofRoleModelDTO_.never.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Omit_any.Extract_never-or-UpdateRequestBodyOmittedKeysT.keyofRoleModelDTO__","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateRequestBody_RoleModelDTO.never.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "TransformKeys_Partial_RoleModelDTO_.Extract_never-or-UpdateRequestBodyOmittedKeysT.keyofRoleModelDTO_.never.never_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RoleUpdateRequest": {
        "dataType" : "refAlias",
        "type"     : { "ref": "UpdateRequestBody_RoleModelDTO.never.never_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DataResponseBody_DeletedResponseContent.Role.DeletedResponseMessageT_": {
        "dataType"   : "refObject",
        "properties" : {
            "data"     : { "ref": "DeletedResponseContent","required": true },
            "message"  : { "ref": "DeletedResponseMessageT","required": true },
            "metadata" : { "ref": "MetaData_Role_" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DeleteResponseBody_Role_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "DataResponseBody_DeletedResponseContent.Role.DeletedResponseMessageT_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RoleDeleteResponse": {
        "dataType" : "refAlias",
        "type"     : { "ref": "DeleteResponseBody_Role_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "NonEmptyString": {
        "dataType" : "refAlias",
        "type"     : { "dataType": "string","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Record_string.boolean_": {
        "dataType" : "refAlias",
        "type"     : { "dataType": "nestedObjectLiteral","nestedProperties": {},"additionalProperties": { "dataType": "boolean" },"validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserModelDTO": {
        "dataType"   : "refObject",
        "properties" : {
            "id"              : { "dataType": "double","required": true },
            "createdAt"       : { "dataType": "datetime","required": true },
            "updatedAt"       : { "dataType": "datetime","required": true },
            "deletedAt"       : { "dataType": "datetime" },
            "#shouldValidate" : { "ref": "Record_string.boolean_","default": { "firstName": true,"lastName": true,"email": true,"password": true,"profileImageURL": true,"profileText": true,"fullName": true,"isAdmin": true,"isStaff": true,"id": true,"createdAt": true,"updatedAt": true,"deletedAt": true } },
            "firstName"       : { "ref": "NonEmptyString","required": true },
            "lastName"        : { "ref": "NonEmptyString","required": true },
            "email"           : { "ref": "NonEmptyString","required": true },
            "password"        : { "ref": "NonEmptyString","required": true },
            "profileImageURL" : { "dataType": "string" },
            "profileText"     : { "dataType": "string" },
            "fullName"        : { "dataType": "string" },
            "isAdmin"         : { "dataType": "boolean" },
            "isStaff"         : { "dataType": "boolean" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_any.Exclude_keyofany.Extract_never-or-ReadResponseContentOmittedKeysT.keyofFeedbackModelDTO___": {
        "dataType" : "refAlias",
        "type"     : { "dataType": "nestedObjectLiteral","nestedProperties": { "updatedAt": { "dataType": "union","subSchemas": [ { "dataType": "datetime" },{ "dataType": "undefined" } ],"required": true },"id": { "dataType": "double","required": true },"createdAt": { "dataType": "datetime","required": true },"authorName": { "dataType": "union","subSchemas": [ { "dataType": "string" },{ "dataType": "undefined" } ] },"title": { "dataType": "string","required": true },"content": { "dataType": "string","required": true },"isPublic": { "dataType": "boolean","required": true },"userId": { "dataType": "union","subSchemas": [ { "dataType": "double" },{ "dataType": "undefined" } ] },"user": { "dataType": "union","subSchemas": [ { "ref": "UserModelDTO" },{ "dataType": "undefined" } ] } },"validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_any.Extract_never-or-ReadResponseContentOmittedKeysT.keyofFeedbackModelDTO__": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Pick_any.Exclude_keyofany.Extract_never-or-ReadResponseContentOmittedKeysT.keyofFeedbackModelDTO___","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransformKeys_FeedbackModelDTO.Extract_never-or-ReadResponseContentOmittedKeysT.keyofFeedbackModelDTO_.Extract_never-or-ReadResponseContentOptionalKeysT.keyofFeedbackModelDTO_.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Omit_any.Extract_never-or-ReadResponseContentOmittedKeysT.keyofFeedbackModelDTO__","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReadResponseContent_FeedbackModelDTO.never.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "TransformKeys_FeedbackModelDTO.Extract_never-or-ReadResponseContentOmittedKeysT.keyofFeedbackModelDTO_.Extract_never-or-ReadResponseContentOptionalKeysT.keyofFeedbackModelDTO_.never_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MetaData_Feedback_": {
        "dataType"   : "refObject",
        "properties" : {
            "dataType": { "dataType": "enum","enums": [ "Feedback" ],"required": true },
        },
        "additionalProperties": { "dataType": "union","subSchemas": [ { "dataType": "object" },{ "dataType": "string" },{ "dataType": "double" },{ "dataType": "boolean" },{ "dataType": "enum","enums": [ null ] },{ "dataType": "undefined" } ] },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DataResponseBody_Array_ReadResponseContent_FeedbackModelDTO.never.never__.Feedback.FoundResponseMessageT_": {
        "dataType"   : "refObject",
        "properties" : {
            "data"     : { "dataType": "array","array": { "dataType": "refAlias","ref": "ReadResponseContent_FeedbackModelDTO.never.never_" },"required": true },
            "message"  : { "ref": "FoundResponseMessageT","required": true },
            "metadata" : { "ref": "MetaData_Feedback_" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "FeedbackReadManyResponse": {
        "dataType" : "refAlias",
        "type"     : { "ref": "DataResponseBody_Array_ReadResponseContent_FeedbackModelDTO.never.never__.Feedback.FoundResponseMessageT_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "FeedbackNotFoundResponseBody": {
        "dataType" : "refAlias",
        "type"     : { "ref": "NotFoundResponseBody","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DataResponseBody_ReadResponseContent_FeedbackModelDTO.never.never_.Feedback.FoundResponseMessageT_": {
        "dataType"   : "refObject",
        "properties" : {
            "data"     : { "ref": "ReadResponseContent_FeedbackModelDTO.never.never_","required": true },
            "message"  : { "ref": "FoundResponseMessageT","required": true },
            "metadata" : { "ref": "MetaData_Feedback_" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "FeedbackReadResponse": {
        "dataType" : "refAlias",
        "type"     : { "ref": "DataResponseBody_ReadResponseContent_FeedbackModelDTO.never.never_.Feedback.FoundResponseMessageT_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_any.Exclude_keyofany.Extract_never-or-CreateResponseContentOmittedKeysT.keyofFeedbackModelDTO___": {
        "dataType" : "refAlias",
        "type"     : { "dataType": "nestedObjectLiteral","nestedProperties": { "id": { "dataType": "double","required": true },"createdAt": { "dataType": "datetime","required": true },"authorName": { "dataType": "union","subSchemas": [ { "dataType": "string" },{ "dataType": "undefined" } ] },"title": { "dataType": "string","required": true },"content": { "dataType": "string","required": true },"isPublic": { "dataType": "boolean","required": true },"userId": { "dataType": "union","subSchemas": [ { "dataType": "double" },{ "dataType": "undefined" } ] },"user": { "dataType": "union","subSchemas": [ { "ref": "UserModelDTO" },{ "dataType": "undefined" } ] } },"validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_any.Extract_never-or-CreateResponseContentOmittedKeysT.keyofFeedbackModelDTO__": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Pick_any.Exclude_keyofany.Extract_never-or-CreateResponseContentOmittedKeysT.keyofFeedbackModelDTO___","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransformKeys_FeedbackModelDTO.Extract_never-or-CreateResponseContentOmittedKeysT.keyofFeedbackModelDTO_.Extract_never-or-CreateResponseContentOptionalKeysT.keyofFeedbackModelDTO_.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Omit_any.Extract_never-or-CreateResponseContentOmittedKeysT.keyofFeedbackModelDTO__","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateResponseContent_FeedbackModelDTO.never.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "TransformKeys_FeedbackModelDTO.Extract_never-or-CreateResponseContentOmittedKeysT.keyofFeedbackModelDTO_.Extract_never-or-CreateResponseContentOptionalKeysT.keyofFeedbackModelDTO_.never_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DataResponseBody_CreateResponseContent_FeedbackModelDTO.never.never_.Feedback.CreatedResponseMessageT_": {
        "dataType"   : "refObject",
        "properties" : {
            "data"     : { "ref": "CreateResponseContent_FeedbackModelDTO.never.never_","required": true },
            "message"  : { "ref": "CreatedResponseMessageT","required": true },
            "metadata" : { "ref": "MetaData_Feedback_" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "FeedbackCreateResponse": {
        "dataType" : "refAlias",
        "type"     : { "ref": "DataResponseBody_CreateResponseContent_FeedbackModelDTO.never.never_.Feedback.CreatedResponseMessageT_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_any.Exclude_keyofany.Extract_never-or-CreateRequestBodyOmittedKeysT.keyofFeedbackModelDTO___": {
        "dataType" : "refAlias",
        "type"     : { "dataType": "nestedObjectLiteral","nestedProperties": { "authorName": { "dataType": "union","subSchemas": [ { "dataType": "string" },{ "dataType": "undefined" } ] },"title": { "dataType": "string","required": true },"content": { "dataType": "string","required": true },"isPublic": { "dataType": "union","subSchemas": [ { "dataType": "boolean" },{ "dataType": "undefined" } ],"required": true },"userId": { "dataType": "union","subSchemas": [ { "dataType": "double" },{ "dataType": "undefined" } ] },"user": { "dataType": "union","subSchemas": [ { "ref": "UserModelDTO" },{ "dataType": "undefined" } ] } },"validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_any.Extract_never-or-CreateRequestBodyOmittedKeysT.keyofFeedbackModelDTO__": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Pick_any.Exclude_keyofany.Extract_never-or-CreateRequestBodyOmittedKeysT.keyofFeedbackModelDTO___","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransformKeys_FeedbackModelDTO.Extract_never-or-CreateRequestBodyOmittedKeysT.keyofFeedbackModelDTO_.isPublic-or-userId.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Omit_any.Extract_never-or-CreateRequestBodyOmittedKeysT.keyofFeedbackModelDTO__","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateRequestBody_FeedbackModelDTO.never.isPublic-or-userId_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "TransformKeys_FeedbackModelDTO.Extract_never-or-CreateRequestBodyOmittedKeysT.keyofFeedbackModelDTO_.isPublic-or-userId.never_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "FeedbackCreateRequest": {
        "dataType" : "refAlias",
        "type"     : { "ref": "CreateRequestBody_FeedbackModelDTO.never.isPublic-or-userId_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_any.Exclude_keyofany.Extract_never-or-UpdateResponseContentOmittedKeysT.keyofFeedbackModelDTO___": {
        "dataType" : "refAlias",
        "type"     : { "dataType": "nestedObjectLiteral","nestedProperties": { "updatedAt": { "dataType": "datetime","required": true },"id": { "dataType": "double","required": true },"createdAt": { "dataType": "datetime","required": true },"authorName": { "dataType": "union","subSchemas": [ { "dataType": "string" },{ "dataType": "undefined" } ] },"title": { "dataType": "string","required": true },"content": { "dataType": "string","required": true },"isPublic": { "dataType": "boolean","required": true },"userId": { "dataType": "union","subSchemas": [ { "dataType": "double" },{ "dataType": "undefined" } ] },"user": { "dataType": "union","subSchemas": [ { "ref": "UserModelDTO" },{ "dataType": "undefined" } ] } },"validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_any.Extract_never-or-UpdateResponseContentOmittedKeysT.keyofFeedbackModelDTO__": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Pick_any.Exclude_keyofany.Extract_never-or-UpdateResponseContentOmittedKeysT.keyofFeedbackModelDTO___","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransformKeys_FeedbackModelDTO.Extract_never-or-UpdateResponseContentOmittedKeysT.keyofFeedbackModelDTO_.never.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Omit_any.Extract_never-or-UpdateResponseContentOmittedKeysT.keyofFeedbackModelDTO__","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateResponseContent_FeedbackModelDTO.never.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "TransformKeys_FeedbackModelDTO.Extract_never-or-UpdateResponseContentOmittedKeysT.keyofFeedbackModelDTO_.never.never_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DataResponseBody_UpdateResponseContent_FeedbackModelDTO.never.never_.Feedback.UpdatedResponseMessageT_": {
        "dataType"   : "refObject",
        "properties" : {
            "data"     : { "ref": "UpdateResponseContent_FeedbackModelDTO.never.never_","required": true },
            "message"  : { "ref": "UpdatedResponseMessageT","required": true },
            "metadata" : { "ref": "MetaData_Feedback_" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "FeedbackUpdateResponse": {
        "dataType" : "refAlias",
        "type"     : { "ref": "DataResponseBody_UpdateResponseContent_FeedbackModelDTO.never.never_.Feedback.UpdatedResponseMessageT_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_any.Exclude_keyofany.Extract_never-or-UpdateRequestBodyOmittedKeysT.keyofFeedbackModelDTO___": {
        "dataType" : "refAlias",
        "type"     : { "dataType": "nestedObjectLiteral","nestedProperties": { "authorName": { "dataType": "union","subSchemas": [ { "dataType": "string" },{ "dataType": "undefined" } ] },"title": { "dataType": "union","subSchemas": [ { "dataType": "string" },{ "dataType": "undefined" } ] },"content": { "dataType": "union","subSchemas": [ { "dataType": "string" },{ "dataType": "undefined" } ] },"isPublic": { "dataType": "union","subSchemas": [ { "dataType": "boolean" },{ "dataType": "undefined" } ] },"userId": { "dataType": "union","subSchemas": [ { "dataType": "double" },{ "dataType": "undefined" } ] },"user": { "dataType": "union","subSchemas": [ { "ref": "UserModelDTO" },{ "dataType": "undefined" } ] } },"validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_any.Extract_never-or-UpdateRequestBodyOmittedKeysT.keyofFeedbackModelDTO__": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Pick_any.Exclude_keyofany.Extract_never-or-UpdateRequestBodyOmittedKeysT.keyofFeedbackModelDTO___","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransformKeys_Partial_FeedbackModelDTO_.Extract_never-or-UpdateRequestBodyOmittedKeysT.keyofFeedbackModelDTO_.never.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Omit_any.Extract_never-or-UpdateRequestBodyOmittedKeysT.keyofFeedbackModelDTO__","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateRequestBody_FeedbackModelDTO.never.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "TransformKeys_Partial_FeedbackModelDTO_.Extract_never-or-UpdateRequestBodyOmittedKeysT.keyofFeedbackModelDTO_.never.never_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "FeedbackUpdateRequest": {
        "dataType" : "refAlias",
        "type"     : { "ref": "UpdateRequestBody_FeedbackModelDTO.never.never_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DataResponseBody_DeletedResponseContent.Feedback.DeletedResponseMessageT_": {
        "dataType"   : "refObject",
        "properties" : {
            "data"     : { "ref": "DeletedResponseContent","required": true },
            "message"  : { "ref": "DeletedResponseMessageT","required": true },
            "metadata" : { "ref": "MetaData_Feedback_" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DeleteResponseBody_Feedback_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "DataResponseBody_DeletedResponseContent.Feedback.DeletedResponseMessageT_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "FeedbackDeleteResponse": {
        "dataType" : "refAlias",
        "type"     : { "ref": "DeleteResponseBody_Feedback_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_any.Exclude_keyofany.Extract_never-or-ReadResponseContentOmittedKeysT.keyofBookingTypeModelDTO___": {
        "dataType" : "refAlias",
        "type"     : { "dataType": "nestedObjectLiteral","nestedProperties": { "name": { "dataType": "string","required": true },"updatedAt": { "dataType": "union","subSchemas": [ { "dataType": "datetime" },{ "dataType": "undefined" } ],"required": true },"id": { "dataType": "double","required": true },"createdAt": { "dataType": "datetime","required": true },"description": { "dataType": "string","required": true },"price": { "dataType": "double","required": true } },"validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_any.Extract_never-or-ReadResponseContentOmittedKeysT.keyofBookingTypeModelDTO__": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Pick_any.Exclude_keyofany.Extract_never-or-ReadResponseContentOmittedKeysT.keyofBookingTypeModelDTO___","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransformKeys_BookingTypeModelDTO.Extract_never-or-ReadResponseContentOmittedKeysT.keyofBookingTypeModelDTO_.Extract_never-or-ReadResponseContentOptionalKeysT.keyofBookingTypeModelDTO_.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Omit_any.Extract_never-or-ReadResponseContentOmittedKeysT.keyofBookingTypeModelDTO__","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReadResponseContent_BookingTypeModelDTO.never.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "TransformKeys_BookingTypeModelDTO.Extract_never-or-ReadResponseContentOmittedKeysT.keyofBookingTypeModelDTO_.Extract_never-or-ReadResponseContentOptionalKeysT.keyofBookingTypeModelDTO_.never_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MetaData_BookingType_": {
        "dataType"   : "refObject",
        "properties" : {
            "dataType": { "dataType": "enum","enums": [ "BookingType" ],"required": true },
        },
        "additionalProperties": { "dataType": "union","subSchemas": [ { "dataType": "object" },{ "dataType": "string" },{ "dataType": "double" },{ "dataType": "boolean" },{ "dataType": "enum","enums": [ null ] },{ "dataType": "undefined" } ] },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DataResponseBody_Array_ReadResponseContent_BookingTypeModelDTO.never.never__.BookingType.FoundResponseMessageT_": {
        "dataType"   : "refObject",
        "properties" : {
            "data"     : { "dataType": "array","array": { "dataType": "refAlias","ref": "ReadResponseContent_BookingTypeModelDTO.never.never_" },"required": true },
            "message"  : { "ref": "FoundResponseMessageT","required": true },
            "metadata" : { "ref": "MetaData_BookingType_" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BookingTypeReadManyResponse": {
        "dataType" : "refAlias",
        "type"     : { "ref": "DataResponseBody_Array_ReadResponseContent_BookingTypeModelDTO.never.never__.BookingType.FoundResponseMessageT_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BookingTypeNotFoundResponseBody": {
        "dataType" : "refAlias",
        "type"     : { "ref": "NotFoundResponseBody","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DataResponseBody_ReadResponseContent_BookingTypeModelDTO.never.never_.BookingType.FoundResponseMessageT_": {
        "dataType"   : "refObject",
        "properties" : {
            "data"     : { "ref": "ReadResponseContent_BookingTypeModelDTO.never.never_","required": true },
            "message"  : { "ref": "FoundResponseMessageT","required": true },
            "metadata" : { "ref": "MetaData_BookingType_" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BookingTypeReadResponse": {
        "dataType" : "refAlias",
        "type"     : { "ref": "DataResponseBody_ReadResponseContent_BookingTypeModelDTO.never.never_.BookingType.FoundResponseMessageT_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_any.Exclude_keyofany.Extract_never-or-CreateResponseContentOmittedKeysT.keyofBookingTypeModelDTO___": {
        "dataType" : "refAlias",
        "type"     : { "dataType": "nestedObjectLiteral","nestedProperties": { "name": { "dataType": "string","required": true },"id": { "dataType": "double","required": true },"createdAt": { "dataType": "datetime","required": true },"description": { "dataType": "string","required": true },"price": { "dataType": "double","required": true } },"validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_any.Extract_never-or-CreateResponseContentOmittedKeysT.keyofBookingTypeModelDTO__": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Pick_any.Exclude_keyofany.Extract_never-or-CreateResponseContentOmittedKeysT.keyofBookingTypeModelDTO___","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransformKeys_BookingTypeModelDTO.Extract_never-or-CreateResponseContentOmittedKeysT.keyofBookingTypeModelDTO_.Extract_never-or-CreateResponseContentOptionalKeysT.keyofBookingTypeModelDTO_.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Omit_any.Extract_never-or-CreateResponseContentOmittedKeysT.keyofBookingTypeModelDTO__","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateResponseContent_BookingTypeModelDTO.never.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "TransformKeys_BookingTypeModelDTO.Extract_never-or-CreateResponseContentOmittedKeysT.keyofBookingTypeModelDTO_.Extract_never-or-CreateResponseContentOptionalKeysT.keyofBookingTypeModelDTO_.never_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DataResponseBody_CreateResponseContent_BookingTypeModelDTO.never.never_.BookingType.CreatedResponseMessageT_": {
        "dataType"   : "refObject",
        "properties" : {
            "data"     : { "ref": "CreateResponseContent_BookingTypeModelDTO.never.never_","required": true },
            "message"  : { "ref": "CreatedResponseMessageT","required": true },
            "metadata" : { "ref": "MetaData_BookingType_" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BookingTypeCreateResponse": {
        "dataType" : "refAlias",
        "type"     : { "ref": "DataResponseBody_CreateResponseContent_BookingTypeModelDTO.never.never_.BookingType.CreatedResponseMessageT_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_any.Exclude_keyofany.Extract_never-or-CreateRequestBodyOmittedKeysT.keyofBookingTypeModelDTO___": {
        "dataType" : "refAlias",
        "type"     : { "dataType": "nestedObjectLiteral","nestedProperties": { "name": { "dataType": "string","required": true },"description": { "dataType": "string","required": true },"price": { "dataType": "double","required": true } },"validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_any.Extract_never-or-CreateRequestBodyOmittedKeysT.keyofBookingTypeModelDTO__": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Pick_any.Exclude_keyofany.Extract_never-or-CreateRequestBodyOmittedKeysT.keyofBookingTypeModelDTO___","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransformKeys_BookingTypeModelDTO.Extract_never-or-CreateRequestBodyOmittedKeysT.keyofBookingTypeModelDTO_.never.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Omit_any.Extract_never-or-CreateRequestBodyOmittedKeysT.keyofBookingTypeModelDTO__","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateRequestBody_BookingTypeModelDTO.never.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "TransformKeys_BookingTypeModelDTO.Extract_never-or-CreateRequestBodyOmittedKeysT.keyofBookingTypeModelDTO_.never.never_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BookingTypeCreateRequest": {
        "dataType" : "refAlias",
        "type"     : { "ref": "CreateRequestBody_BookingTypeModelDTO.never.never_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_any.Exclude_keyofany.Extract_never-or-UpdateResponseContentOmittedKeysT.keyofBookingTypeModelDTO___": {
        "dataType" : "refAlias",
        "type"     : { "dataType": "nestedObjectLiteral","nestedProperties": { "name": { "dataType": "string","required": true },"updatedAt": { "dataType": "datetime","required": true },"id": { "dataType": "double","required": true },"createdAt": { "dataType": "datetime","required": true },"description": { "dataType": "string","required": true },"price": { "dataType": "double","required": true } },"validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_any.Extract_never-or-UpdateResponseContentOmittedKeysT.keyofBookingTypeModelDTO__": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Pick_any.Exclude_keyofany.Extract_never-or-UpdateResponseContentOmittedKeysT.keyofBookingTypeModelDTO___","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransformKeys_BookingTypeModelDTO.Extract_never-or-UpdateResponseContentOmittedKeysT.keyofBookingTypeModelDTO_.never.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Omit_any.Extract_never-or-UpdateResponseContentOmittedKeysT.keyofBookingTypeModelDTO__","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateResponseContent_BookingTypeModelDTO.never.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "TransformKeys_BookingTypeModelDTO.Extract_never-or-UpdateResponseContentOmittedKeysT.keyofBookingTypeModelDTO_.never.never_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DataResponseBody_UpdateResponseContent_BookingTypeModelDTO.never.never_.BookingType.UpdatedResponseMessageT_": {
        "dataType"   : "refObject",
        "properties" : {
            "data"     : { "ref": "UpdateResponseContent_BookingTypeModelDTO.never.never_","required": true },
            "message"  : { "ref": "UpdatedResponseMessageT","required": true },
            "metadata" : { "ref": "MetaData_BookingType_" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BookingTypeUpdateResponse": {
        "dataType" : "refAlias",
        "type"     : { "ref": "DataResponseBody_UpdateResponseContent_BookingTypeModelDTO.never.never_.BookingType.UpdatedResponseMessageT_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_any.Exclude_keyofany.Extract_never-or-UpdateRequestBodyOmittedKeysT.keyofBookingTypeModelDTO___": {
        "dataType" : "refAlias",
        "type"     : { "dataType": "nestedObjectLiteral","nestedProperties": { "name": { "dataType": "union","subSchemas": [ { "dataType": "string" },{ "dataType": "undefined" } ] },"description": { "dataType": "union","subSchemas": [ { "dataType": "string" },{ "dataType": "undefined" } ] },"price": { "dataType": "union","subSchemas": [ { "dataType": "double" },{ "dataType": "undefined" } ] } },"validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_any.Extract_never-or-UpdateRequestBodyOmittedKeysT.keyofBookingTypeModelDTO__": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Pick_any.Exclude_keyofany.Extract_never-or-UpdateRequestBodyOmittedKeysT.keyofBookingTypeModelDTO___","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransformKeys_Partial_BookingTypeModelDTO_.Extract_never-or-UpdateRequestBodyOmittedKeysT.keyofBookingTypeModelDTO_.never.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Omit_any.Extract_never-or-UpdateRequestBodyOmittedKeysT.keyofBookingTypeModelDTO__","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateRequestBody_BookingTypeModelDTO.never.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "TransformKeys_Partial_BookingTypeModelDTO_.Extract_never-or-UpdateRequestBodyOmittedKeysT.keyofBookingTypeModelDTO_.never.never_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BookingTypeUpdateRequest": {
        "dataType" : "refAlias",
        "type"     : { "ref": "UpdateRequestBody_BookingTypeModelDTO.never.never_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DataResponseBody_DeletedResponseContent.BookingType.DeletedResponseMessageT_": {
        "dataType"   : "refObject",
        "properties" : {
            "data"     : { "ref": "DeletedResponseContent","required": true },
            "message"  : { "ref": "DeletedResponseMessageT","required": true },
            "metadata" : { "ref": "MetaData_BookingType_" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DeleteResponseBody_BookingType_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "DataResponseBody_DeletedResponseContent.BookingType.DeletedResponseMessageT_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BookingTypeDeleteResponse": {
        "dataType" : "refAlias",
        "type"     : { "ref": "DeleteResponseBody_BookingType_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BookingTypeModelDTO": {
        "dataType"   : "refObject",
        "properties" : {
            "id"              : { "dataType": "double","required": true },
            "createdAt"       : { "dataType": "datetime","required": true },
            "updatedAt"       : { "dataType": "datetime","required": true },
            "deletedAt"       : { "dataType": "datetime" },
            "#shouldValidate" : { "ref": "Record_string.boolean_","default": { "name": true,"description": true,"price": true,"id": true,"createdAt": true,"updatedAt": true,"deletedAt": true } },
            "name"            : { "ref": "NonEmptyString","required": true },
            "description"     : { "ref": "NonEmptyString","required": true },
            "price"           : { "dataType": "double","required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_any.Exclude_keyofany.Extract_never-or-ReadResponseContentOmittedKeysT.keyofBookingModelDTO___": {
        "dataType" : "refAlias",
        "type"     : { "dataType": "nestedObjectLiteral","nestedProperties": { "updatedAt": { "dataType": "union","subSchemas": [ { "dataType": "datetime" },{ "dataType": "undefined" } ],"required": true },"id": { "dataType": "double","required": true },"createdAt": { "dataType": "datetime","required": true },"userId": { "dataType": "double","required": true },"user": { "dataType": "union","subSchemas": [ { "ref": "UserModelDTO" },{ "dataType": "undefined" } ] },"bookingDate": { "dataType": "datetime","required": true },"bookingNotes": { "dataType": "union","subSchemas": [ { "dataType": "string" },{ "dataType": "undefined" } ] },"bookingTypeId": { "dataType": "double","required": true },"bookingType": { "dataType": "union","subSchemas": [ { "ref": "BookingTypeModelDTO" },{ "dataType": "undefined" } ] } },"validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_any.Extract_never-or-ReadResponseContentOmittedKeysT.keyofBookingModelDTO__": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Pick_any.Exclude_keyofany.Extract_never-or-ReadResponseContentOmittedKeysT.keyofBookingModelDTO___","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransformKeys_BookingModelDTO.Extract_never-or-ReadResponseContentOmittedKeysT.keyofBookingModelDTO_.Extract_never-or-ReadResponseContentOptionalKeysT.keyofBookingModelDTO_.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Omit_any.Extract_never-or-ReadResponseContentOmittedKeysT.keyofBookingModelDTO__","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReadResponseContent_BookingModelDTO.never.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "TransformKeys_BookingModelDTO.Extract_never-or-ReadResponseContentOmittedKeysT.keyofBookingModelDTO_.Extract_never-or-ReadResponseContentOptionalKeysT.keyofBookingModelDTO_.never_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MetaData_Booking_": {
        "dataType"   : "refObject",
        "properties" : {
            "dataType": { "dataType": "enum","enums": [ "Booking" ],"required": true },
        },
        "additionalProperties": { "dataType": "union","subSchemas": [ { "dataType": "object" },{ "dataType": "string" },{ "dataType": "double" },{ "dataType": "boolean" },{ "dataType": "enum","enums": [ null ] },{ "dataType": "undefined" } ] },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DataResponseBody_Array_ReadResponseContent_BookingModelDTO.never.never__.Booking.FoundResponseMessageT_": {
        "dataType"   : "refObject",
        "properties" : {
            "data"     : { "dataType": "array","array": { "dataType": "refAlias","ref": "ReadResponseContent_BookingModelDTO.never.never_" },"required": true },
            "message"  : { "ref": "FoundResponseMessageT","required": true },
            "metadata" : { "ref": "MetaData_Booking_" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BookingReadManyResponse": {
        "dataType" : "refAlias",
        "type"     : { "ref": "DataResponseBody_Array_ReadResponseContent_BookingModelDTO.never.never__.Booking.FoundResponseMessageT_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BookingNotFoundResponseBody": {
        "dataType" : "refAlias",
        "type"     : { "ref": "NotFoundResponseBody","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DataResponseBody_ReadResponseContent_BookingModelDTO.never.never_.Booking.FoundResponseMessageT_": {
        "dataType"   : "refObject",
        "properties" : {
            "data"     : { "ref": "ReadResponseContent_BookingModelDTO.never.never_","required": true },
            "message"  : { "ref": "FoundResponseMessageT","required": true },
            "metadata" : { "ref": "MetaData_Booking_" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BookingReadResponse": {
        "dataType" : "refAlias",
        "type"     : { "ref": "DataResponseBody_ReadResponseContent_BookingModelDTO.never.never_.Booking.FoundResponseMessageT_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_any.Exclude_keyofany.Extract_never-or-CreateResponseContentOmittedKeysT.keyofBookingModelDTO___": {
        "dataType" : "refAlias",
        "type"     : { "dataType": "nestedObjectLiteral","nestedProperties": { "id": { "dataType": "double","required": true },"createdAt": { "dataType": "datetime","required": true },"userId": { "dataType": "double","required": true },"user": { "dataType": "union","subSchemas": [ { "ref": "UserModelDTO" },{ "dataType": "undefined" } ] },"bookingDate": { "dataType": "datetime","required": true },"bookingNotes": { "dataType": "union","subSchemas": [ { "dataType": "string" },{ "dataType": "undefined" } ] },"bookingTypeId": { "dataType": "double","required": true },"bookingType": { "dataType": "union","subSchemas": [ { "ref": "BookingTypeModelDTO" },{ "dataType": "undefined" } ] } },"validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_any.Extract_never-or-CreateResponseContentOmittedKeysT.keyofBookingModelDTO__": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Pick_any.Exclude_keyofany.Extract_never-or-CreateResponseContentOmittedKeysT.keyofBookingModelDTO___","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransformKeys_BookingModelDTO.Extract_never-or-CreateResponseContentOmittedKeysT.keyofBookingModelDTO_.Extract_never-or-CreateResponseContentOptionalKeysT.keyofBookingModelDTO_.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Omit_any.Extract_never-or-CreateResponseContentOmittedKeysT.keyofBookingModelDTO__","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateResponseContent_BookingModelDTO.never.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "TransformKeys_BookingModelDTO.Extract_never-or-CreateResponseContentOmittedKeysT.keyofBookingModelDTO_.Extract_never-or-CreateResponseContentOptionalKeysT.keyofBookingModelDTO_.never_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DataResponseBody_CreateResponseContent_BookingModelDTO.never.never_.Booking.CreatedResponseMessageT_": {
        "dataType"   : "refObject",
        "properties" : {
            "data"     : { "ref": "CreateResponseContent_BookingModelDTO.never.never_","required": true },
            "message"  : { "ref": "CreatedResponseMessageT","required": true },
            "metadata" : { "ref": "MetaData_Booking_" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BookingCreateResponse": {
        "dataType" : "refAlias",
        "type"     : { "ref": "DataResponseBody_CreateResponseContent_BookingModelDTO.never.never_.Booking.CreatedResponseMessageT_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_any.Exclude_keyofany.Extract_bookingType-or-CreateRequestBodyOmittedKeysT.keyofBookingModelDTO___": {
        "dataType" : "refAlias",
        "type"     : { "dataType": "nestedObjectLiteral","nestedProperties": { "userId": { "dataType": "double","required": true },"user": { "dataType": "union","subSchemas": [ { "ref": "UserModelDTO" },{ "dataType": "undefined" } ] },"bookingDate": { "dataType": "datetime","required": true },"bookingNotes": { "dataType": "union","subSchemas": [ { "dataType": "string" },{ "dataType": "undefined" } ] },"bookingTypeId": { "dataType": "double","required": true } },"validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_any.Extract_bookingType-or-CreateRequestBodyOmittedKeysT.keyofBookingModelDTO__": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Pick_any.Exclude_keyofany.Extract_bookingType-or-CreateRequestBodyOmittedKeysT.keyofBookingModelDTO___","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransformKeys_BookingModelDTO.Extract_bookingType-or-CreateRequestBodyOmittedKeysT.keyofBookingModelDTO_.never.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Omit_any.Extract_bookingType-or-CreateRequestBodyOmittedKeysT.keyofBookingModelDTO__","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateRequestBody_BookingModelDTO.bookingType.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "TransformKeys_BookingModelDTO.Extract_bookingType-or-CreateRequestBodyOmittedKeysT.keyofBookingModelDTO_.never.never_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BookingCreateRequest": {
        "dataType" : "refAlias",
        "type"     : { "ref": "CreateRequestBody_BookingModelDTO.bookingType.never_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_any.Exclude_keyofany.Extract_never-or-UpdateResponseContentOmittedKeysT.keyofBookingModelDTO___": {
        "dataType" : "refAlias",
        "type"     : { "dataType": "nestedObjectLiteral","nestedProperties": { "updatedAt": { "dataType": "datetime","required": true },"id": { "dataType": "double","required": true },"createdAt": { "dataType": "datetime","required": true },"userId": { "dataType": "double","required": true },"user": { "dataType": "union","subSchemas": [ { "ref": "UserModelDTO" },{ "dataType": "undefined" } ] },"bookingDate": { "dataType": "datetime","required": true },"bookingNotes": { "dataType": "union","subSchemas": [ { "dataType": "string" },{ "dataType": "undefined" } ] },"bookingTypeId": { "dataType": "double","required": true },"bookingType": { "dataType": "union","subSchemas": [ { "ref": "BookingTypeModelDTO" },{ "dataType": "undefined" } ] } },"validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_any.Extract_never-or-UpdateResponseContentOmittedKeysT.keyofBookingModelDTO__": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Pick_any.Exclude_keyofany.Extract_never-or-UpdateResponseContentOmittedKeysT.keyofBookingModelDTO___","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransformKeys_BookingModelDTO.Extract_never-or-UpdateResponseContentOmittedKeysT.keyofBookingModelDTO_.never.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Omit_any.Extract_never-or-UpdateResponseContentOmittedKeysT.keyofBookingModelDTO__","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateResponseContent_BookingModelDTO.never.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "TransformKeys_BookingModelDTO.Extract_never-or-UpdateResponseContentOmittedKeysT.keyofBookingModelDTO_.never.never_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DataResponseBody_UpdateResponseContent_BookingModelDTO.never.never_.Booking.UpdatedResponseMessageT_": {
        "dataType"   : "refObject",
        "properties" : {
            "data"     : { "ref": "UpdateResponseContent_BookingModelDTO.never.never_","required": true },
            "message"  : { "ref": "UpdatedResponseMessageT","required": true },
            "metadata" : { "ref": "MetaData_Booking_" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BookingUpdateResponse": {
        "dataType" : "refAlias",
        "type"     : { "ref": "DataResponseBody_UpdateResponseContent_BookingModelDTO.never.never_.Booking.UpdatedResponseMessageT_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_any.Exclude_keyofany.Extract_bookingType-or-UpdateRequestBodyOmittedKeysT.keyofBookingModelDTO___": {
        "dataType" : "refAlias",
        "type"     : { "dataType": "nestedObjectLiteral","nestedProperties": { "userId": { "dataType": "union","subSchemas": [ { "dataType": "double" },{ "dataType": "undefined" } ] },"user": { "dataType": "union","subSchemas": [ { "ref": "UserModelDTO" },{ "dataType": "undefined" } ] },"bookingDate": { "dataType": "union","subSchemas": [ { "dataType": "datetime" },{ "dataType": "undefined" } ] },"bookingNotes": { "dataType": "union","subSchemas": [ { "dataType": "string" },{ "dataType": "undefined" } ] },"bookingTypeId": { "dataType": "union","subSchemas": [ { "dataType": "double" },{ "dataType": "undefined" } ] } },"validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_any.Extract_bookingType-or-UpdateRequestBodyOmittedKeysT.keyofBookingModelDTO__": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Pick_any.Exclude_keyofany.Extract_bookingType-or-UpdateRequestBodyOmittedKeysT.keyofBookingModelDTO___","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransformKeys_Partial_BookingModelDTO_.Extract_bookingType-or-UpdateRequestBodyOmittedKeysT.keyofBookingModelDTO_.never.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Omit_any.Extract_bookingType-or-UpdateRequestBodyOmittedKeysT.keyofBookingModelDTO__","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateRequestBody_BookingModelDTO.bookingType.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "TransformKeys_Partial_BookingModelDTO_.Extract_bookingType-or-UpdateRequestBodyOmittedKeysT.keyofBookingModelDTO_.never.never_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BookingUpdateRequest": {
        "dataType" : "refAlias",
        "type"     : { "ref": "UpdateRequestBody_BookingModelDTO.bookingType.never_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DataResponseBody_DeletedResponseContent.Booking.DeletedResponseMessageT_": {
        "dataType"   : "refObject",
        "properties" : {
            "data"     : { "ref": "DeletedResponseContent","required": true },
            "message"  : { "ref": "DeletedResponseMessageT","required": true },
            "metadata" : { "ref": "MetaData_Booking_" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DeleteResponseBody_Booking_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "DataResponseBody_DeletedResponseContent.Booking.DeletedResponseMessageT_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BookingDeleteResponse": {
        "dataType" : "refAlias",
        "type"     : { "ref": "DeleteResponseBody_Booking_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TagModelDTO": {
        "dataType"   : "refObject",
        "properties" : {
            "id"              : { "dataType": "double","required": true },
            "createdAt"       : { "dataType": "datetime","required": true },
            "updatedAt"       : { "dataType": "datetime","required": true },
            "deletedAt"       : { "dataType": "datetime" },
            "#shouldValidate" : { "ref": "Record_string.boolean_","default": { "name": true,"cssColour": true,"id": true,"createdAt": true,"updatedAt": true,"deletedAt": true } },
            "name"            : { "ref": "NonEmptyString","required": true },
            "cssColour"       : { "ref": "NonEmptyString","required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_any.Exclude_keyofany.Extract_never-or-ReadResponseContentOmittedKeysT.keyofBlogModelDTO___": {
        "dataType" : "refAlias",
        "type"     : { "dataType": "nestedObjectLiteral","nestedProperties": { "updatedAt": { "dataType": "union","subSchemas": [ { "dataType": "datetime" },{ "dataType": "undefined" } ],"required": true },"id": { "dataType": "double","required": true },"createdAt": { "dataType": "datetime","required": true },"title": { "dataType": "string","required": true },"content": { "dataType": "string","required": true },"userId": { "dataType": "double","required": true },"user": { "dataType": "union","subSchemas": [ { "ref": "UserModelDTO" },{ "dataType": "undefined" } ] },"imageURL": { "dataType": "union","subSchemas": [ { "dataType": "string" },{ "dataType": "undefined" } ] },"publishedDate": { "dataType": "union","subSchemas": [ { "dataType": "datetime" },{ "dataType": "undefined" } ] },"isPublished": { "dataType": "boolean","required": true },"tags": { "dataType": "union","subSchemas": [ { "dataType": "array","array": { "dataType": "refObject","ref": "TagModelDTO" } },{ "dataType": "undefined" } ] } },"validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_any.Extract_never-or-ReadResponseContentOmittedKeysT.keyofBlogModelDTO__": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Pick_any.Exclude_keyofany.Extract_never-or-ReadResponseContentOmittedKeysT.keyofBlogModelDTO___","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransformKeys_BlogModelDTO.Extract_never-or-ReadResponseContentOmittedKeysT.keyofBlogModelDTO_.Extract_imageURL-or-publishedDate-or-ReadResponseContentOptionalKeysT.keyofBlogModelDTO_.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Omit_any.Extract_never-or-ReadResponseContentOmittedKeysT.keyofBlogModelDTO__","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReadResponseContent_BlogModelDTO.never.imageURL-or-publishedDate_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "TransformKeys_BlogModelDTO.Extract_never-or-ReadResponseContentOmittedKeysT.keyofBlogModelDTO_.Extract_imageURL-or-publishedDate-or-ReadResponseContentOptionalKeysT.keyofBlogModelDTO_.never_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MetaData_Blog_": {
        "dataType"   : "refObject",
        "properties" : {
            "dataType": { "dataType": "enum","enums": [ "Blog" ],"required": true },
        },
        "additionalProperties": { "dataType": "union","subSchemas": [ { "dataType": "object" },{ "dataType": "string" },{ "dataType": "double" },{ "dataType": "boolean" },{ "dataType": "enum","enums": [ null ] },{ "dataType": "undefined" } ] },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DataResponseBody_Array_ReadResponseContent_BlogModelDTO.never.imageURL-or-publishedDate__.Blog.FoundResponseMessageT_": {
        "dataType"   : "refObject",
        "properties" : {
            "data"     : { "dataType": "array","array": { "dataType": "refAlias","ref": "ReadResponseContent_BlogModelDTO.never.imageURL-or-publishedDate_" },"required": true },
            "message"  : { "ref": "FoundResponseMessageT","required": true },
            "metadata" : { "ref": "MetaData_Blog_" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BlogReadManyResponse": {
        "dataType" : "refAlias",
        "type"     : { "ref": "DataResponseBody_Array_ReadResponseContent_BlogModelDTO.never.imageURL-or-publishedDate__.Blog.FoundResponseMessageT_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BlogNotFoundResponseBody": {
        "dataType" : "refAlias",
        "type"     : { "ref": "NotFoundResponseBody","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DataResponseBody_ReadResponseContent_BlogModelDTO.never.imageURL-or-publishedDate_.Blog.FoundResponseMessageT_": {
        "dataType"   : "refObject",
        "properties" : {
            "data"     : { "ref": "ReadResponseContent_BlogModelDTO.never.imageURL-or-publishedDate_","required": true },
            "message"  : { "ref": "FoundResponseMessageT","required": true },
            "metadata" : { "ref": "MetaData_Blog_" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BlogReadResponse": {
        "dataType" : "refAlias",
        "type"     : { "ref": "DataResponseBody_ReadResponseContent_BlogModelDTO.never.imageURL-or-publishedDate_.Blog.FoundResponseMessageT_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_any.Exclude_keyofany.Extract_never-or-CreateResponseContentOmittedKeysT.keyofBlogModelDTO___": {
        "dataType" : "refAlias",
        "type"     : { "dataType": "nestedObjectLiteral","nestedProperties": { "id": { "dataType": "double","required": true },"createdAt": { "dataType": "datetime","required": true },"title": { "dataType": "string","required": true },"content": { "dataType": "string","required": true },"userId": { "dataType": "double","required": true },"user": { "dataType": "union","subSchemas": [ { "ref": "UserModelDTO" },{ "dataType": "undefined" } ] },"imageURL": { "dataType": "union","subSchemas": [ { "dataType": "string" },{ "dataType": "undefined" } ] },"publishedDate": { "dataType": "union","subSchemas": [ { "dataType": "datetime" },{ "dataType": "undefined" } ] },"isPublished": { "dataType": "boolean","required": true },"tags": { "dataType": "union","subSchemas": [ { "dataType": "array","array": { "dataType": "refObject","ref": "TagModelDTO" } },{ "dataType": "undefined" } ] } },"validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_any.Extract_never-or-CreateResponseContentOmittedKeysT.keyofBlogModelDTO__": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Pick_any.Exclude_keyofany.Extract_never-or-CreateResponseContentOmittedKeysT.keyofBlogModelDTO___","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransformKeys_BlogModelDTO.Extract_never-or-CreateResponseContentOmittedKeysT.keyofBlogModelDTO_.Extract_imageURL-or-publishedDate-or-CreateResponseContentOptionalKeysT.keyofBlogModelDTO_.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Omit_any.Extract_never-or-CreateResponseContentOmittedKeysT.keyofBlogModelDTO__","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateResponseContent_BlogModelDTO.never.imageURL-or-publishedDate_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "TransformKeys_BlogModelDTO.Extract_never-or-CreateResponseContentOmittedKeysT.keyofBlogModelDTO_.Extract_imageURL-or-publishedDate-or-CreateResponseContentOptionalKeysT.keyofBlogModelDTO_.never_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DataResponseBody_CreateResponseContent_BlogModelDTO.never.imageURL-or-publishedDate_.Blog.CreatedResponseMessageT_": {
        "dataType"   : "refObject",
        "properties" : {
            "data"     : { "ref": "CreateResponseContent_BlogModelDTO.never.imageURL-or-publishedDate_","required": true },
            "message"  : { "ref": "CreatedResponseMessageT","required": true },
            "metadata" : { "ref": "MetaData_Blog_" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BlogCreateResponse": {
        "dataType" : "refAlias",
        "type"     : { "ref": "DataResponseBody_CreateResponseContent_BlogModelDTO.never.imageURL-or-publishedDate_.Blog.CreatedResponseMessageT_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_any.Exclude_keyofany.Extract_user-or-tags-or-CreateRequestBodyOmittedKeysT.keyofBlogModelDTO___": {
        "dataType" : "refAlias",
        "type"     : { "dataType": "nestedObjectLiteral","nestedProperties": { "title": { "dataType": "string","required": true },"content": { "dataType": "string","required": true },"userId": { "dataType": "double","required": true },"imageURL": { "dataType": "union","subSchemas": [ { "dataType": "string" },{ "dataType": "undefined" } ] },"publishedDate": { "dataType": "union","subSchemas": [ { "dataType": "datetime" },{ "dataType": "undefined" } ] },"isPublished": { "dataType": "boolean","required": true } },"validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_any.Extract_user-or-tags-or-CreateRequestBodyOmittedKeysT.keyofBlogModelDTO__": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Pick_any.Exclude_keyofany.Extract_user-or-tags-or-CreateRequestBodyOmittedKeysT.keyofBlogModelDTO___","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransformKeys_BlogModelDTO.Extract_user-or-tags-or-CreateRequestBodyOmittedKeysT.keyofBlogModelDTO_.imageURL-or-publishedDate.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Omit_any.Extract_user-or-tags-or-CreateRequestBodyOmittedKeysT.keyofBlogModelDTO__","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateRequestBody_BlogModelDTO.user-or-tags.imageURL-or-publishedDate_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "TransformKeys_BlogModelDTO.Extract_user-or-tags-or-CreateRequestBodyOmittedKeysT.keyofBlogModelDTO_.imageURL-or-publishedDate.never_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BlogCreateRequest": {
        "dataType" : "refAlias",
        "type"     : { "ref": "CreateRequestBody_BlogModelDTO.user-or-tags.imageURL-or-publishedDate_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_any.Exclude_keyofany.Extract_never-or-UpdateResponseContentOmittedKeysT.keyofBlogModelDTO___": {
        "dataType" : "refAlias",
        "type"     : { "dataType": "nestedObjectLiteral","nestedProperties": { "updatedAt": { "dataType": "datetime","required": true },"id": { "dataType": "double","required": true },"createdAt": { "dataType": "datetime","required": true },"title": { "dataType": "string","required": true },"content": { "dataType": "string","required": true },"userId": { "dataType": "double","required": true },"user": { "dataType": "union","subSchemas": [ { "ref": "UserModelDTO" },{ "dataType": "undefined" } ] },"imageURL": { "dataType": "union","subSchemas": [ { "dataType": "string" },{ "dataType": "undefined" } ] },"publishedDate": { "dataType": "union","subSchemas": [ { "dataType": "datetime" },{ "dataType": "undefined" } ] },"isPublished": { "dataType": "boolean","required": true },"tags": { "dataType": "union","subSchemas": [ { "dataType": "array","array": { "dataType": "refObject","ref": "TagModelDTO" } },{ "dataType": "undefined" } ] } },"validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_any.Extract_never-or-UpdateResponseContentOmittedKeysT.keyofBlogModelDTO__": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Pick_any.Exclude_keyofany.Extract_never-or-UpdateResponseContentOmittedKeysT.keyofBlogModelDTO___","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransformKeys_BlogModelDTO.Extract_never-or-UpdateResponseContentOmittedKeysT.keyofBlogModelDTO_.imageURL-or-publishedDate.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Omit_any.Extract_never-or-UpdateResponseContentOmittedKeysT.keyofBlogModelDTO__","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateResponseContent_BlogModelDTO.never.imageURL-or-publishedDate_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "TransformKeys_BlogModelDTO.Extract_never-or-UpdateResponseContentOmittedKeysT.keyofBlogModelDTO_.imageURL-or-publishedDate.never_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DataResponseBody_UpdateResponseContent_BlogModelDTO.never.imageURL-or-publishedDate_.Blog.UpdatedResponseMessageT_": {
        "dataType"   : "refObject",
        "properties" : {
            "data"     : { "ref": "UpdateResponseContent_BlogModelDTO.never.imageURL-or-publishedDate_","required": true },
            "message"  : { "ref": "UpdatedResponseMessageT","required": true },
            "metadata" : { "ref": "MetaData_Blog_" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BlogUpdateResponse": {
        "dataType" : "refAlias",
        "type"     : { "ref": "DataResponseBody_UpdateResponseContent_BlogModelDTO.never.imageURL-or-publishedDate_.Blog.UpdatedResponseMessageT_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_any.Exclude_keyofany.Extract_user-or-tags-or-UpdateRequestBodyOmittedKeysT.keyofBlogModelDTO___": {
        "dataType" : "refAlias",
        "type"     : { "dataType": "nestedObjectLiteral","nestedProperties": { "title": { "dataType": "union","subSchemas": [ { "dataType": "string" },{ "dataType": "undefined" } ] },"content": { "dataType": "union","subSchemas": [ { "dataType": "string" },{ "dataType": "undefined" } ] },"userId": { "dataType": "union","subSchemas": [ { "dataType": "double" },{ "dataType": "undefined" } ] },"imageURL": { "dataType": "union","subSchemas": [ { "dataType": "string" },{ "dataType": "undefined" } ] },"publishedDate": { "dataType": "union","subSchemas": [ { "dataType": "datetime" },{ "dataType": "undefined" } ] },"isPublished": { "dataType": "union","subSchemas": [ { "dataType": "boolean" },{ "dataType": "undefined" } ] } },"validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_any.Extract_user-or-tags-or-UpdateRequestBodyOmittedKeysT.keyofBlogModelDTO__": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Pick_any.Exclude_keyofany.Extract_user-or-tags-or-UpdateRequestBodyOmittedKeysT.keyofBlogModelDTO___","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TransformKeys_Partial_BlogModelDTO_.Extract_user-or-tags-or-UpdateRequestBodyOmittedKeysT.keyofBlogModelDTO_.never.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "Omit_any.Extract_user-or-tags-or-UpdateRequestBodyOmittedKeysT.keyofBlogModelDTO__","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateRequestBody_BlogModelDTO.user-or-tags.never_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "TransformKeys_Partial_BlogModelDTO_.Extract_user-or-tags-or-UpdateRequestBodyOmittedKeysT.keyofBlogModelDTO_.never.never_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BlogUpdateRequest": {
        "dataType" : "refAlias",
        "type"     : { "ref": "UpdateRequestBody_BlogModelDTO.user-or-tags.never_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DataResponseBody_DeletedResponseContent.Blog.DeletedResponseMessageT_": {
        "dataType"   : "refObject",
        "properties" : {
            "data"     : { "ref": "DeletedResponseContent","required": true },
            "message"  : { "ref": "DeletedResponseMessageT","required": true },
            "metadata" : { "ref": "MetaData_Blog_" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DeleteResponseBody_Blog_": {
        "dataType" : "refAlias",
        "type"     : { "ref": "DataResponseBody_DeletedResponseContent.Blog.DeletedResponseMessageT_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BlogDeleteResponse": {
        "dataType" : "refAlias",
        "type"     : { "ref": "DeleteResponseBody_Blog_","validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}
const templateService = new ExpressTemplateService( models, { "noImplicitAdditionalProperties": "throw-on-extras","bodyCoercion": true } )

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes( app: Router ) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
    app.get( "/users",
        ...( fetchMiddlewares<RequestHandler>( UserController ) ),
        ...( fetchMiddlewares<RequestHandler>( UserController.prototype.getAllUsers ) ),

        async function UserController_getAllUsers( request: ExRequest, response: ExResponse, next: any ) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                offset           : { "in": "query","name": "offset","dataType": "double" },
                limit            : { "in": "query","name": "limit","dataType": "double" },
                orderBy          : { "in": "query","name": "orderBy","ref": "OrderByFieldValues" },
                filters          : { "in": "query","name": "filters","dataType": "string" },
                notFoundResponse : { "in": "res","name": "404","required": true,"ref": "UserNotFoundResponseBody" },
                request          : { "in": "request","name": "request","dataType": "object" },
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = []
            try {
                validatedArgs = templateService.getValidatedArgs( { args, request, response } )

                const container: IocContainer = typeof iocContainer === "function" ? ( iocContainer as IocContainerFactory )( request ) : iocContainer

                const controller: any = await container.get<UserController>( UserController )
                if ( typeof controller.setStatus === "function" ) {
                    controller.setStatus( undefined )
                }

                await templateService.apiHandler( {
                    methodName    : "getAllUsers",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus : undefined,
                } )
            } catch ( err ) {
                return next( err )
            }
        } )
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get( "/users/:id",
        ...( fetchMiddlewares<RequestHandler>( UserController ) ),
        ...( fetchMiddlewares<RequestHandler>( UserController.prototype.getUser ) ),

        async function UserController_getUser( request: ExRequest, response: ExResponse, next: any ) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                id               : { "in": "path","name": "id","required": true,"ref": "AppModelIdT" },
                notFoundResponse : { "in": "res","name": "404","required": true,"ref": "UserNotFoundResponseBody" },
                request          : { "in": "request","name": "request","dataType": "object" },
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = []
            try {
                validatedArgs = templateService.getValidatedArgs( { args, request, response } )

                const container: IocContainer = typeof iocContainer === "function" ? ( iocContainer as IocContainerFactory )( request ) : iocContainer

                const controller: any = await container.get<UserController>( UserController )
                if ( typeof controller.setStatus === "function" ) {
                    controller.setStatus( undefined )
                }

                await templateService.apiHandler( {
                    methodName    : "getUser",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus : undefined,
                } )
            } catch ( err ) {
                return next( err )
            }
        } )
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post( "/users",
        authenticateMiddleware( [ { "api_key": [] },{ "oauth2": [ "admin" ] } ] ),
        ...( fetchMiddlewares<RequestHandler>( UserController ) ),
        ...( fetchMiddlewares<RequestHandler>( UserController.prototype.createUser ) ),

        async function UserController_createUser( request: ExRequest, response: ExResponse, next: any ) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                user    : { "in": "body","name": "user","required": true,"ref": "UserCreateRequest" },
                request : { "in": "request","name": "request","dataType": "object" },
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = []
            try {
                validatedArgs = templateService.getValidatedArgs( { args, request, response } )

                const container: IocContainer = typeof iocContainer === "function" ? ( iocContainer as IocContainerFactory )( request ) : iocContainer

                const controller: any = await container.get<UserController>( UserController )
                if ( typeof controller.setStatus === "function" ) {
                    controller.setStatus( undefined )
                }

                await templateService.apiHandler( {
                    methodName    : "createUser",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus : undefined,
                } )
            } catch ( err ) {
                return next( err )
            }
        } )
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.patch( "/users/:id",
        authenticateMiddleware( [ { "api_key": [] },{ "oauth2": [ "user" ] } ] ),
        ...( fetchMiddlewares<RequestHandler>( UserController ) ),
        ...( fetchMiddlewares<RequestHandler>( UserController.prototype.updateUser ) ),

        async function UserController_updateUser( request: ExRequest, response: ExResponse, next: any ) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                id               : { "in": "path","name": "id","required": true,"ref": "AppModelIdT" },
                user             : { "in": "body","name": "user","required": true,"ref": "UserUpdateRequest" },
                notFoundResponse : { "in": "res","name": "404","required": true,"ref": "UserNotFoundResponseBody" },
                _request         : { "in": "request","name": "_request","required": true,"dataType": "object" },
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = []
            try {
                validatedArgs = templateService.getValidatedArgs( { args, request, response } )

                const container: IocContainer = typeof iocContainer === "function" ? ( iocContainer as IocContainerFactory )( request ) : iocContainer

                const controller: any = await container.get<UserController>( UserController )
                if ( typeof controller.setStatus === "function" ) {
                    controller.setStatus( undefined )
                }

                await templateService.apiHandler( {
                    methodName    : "updateUser",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus : undefined,
                } )
            } catch ( err ) {
                return next( err )
            }
        } )
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.delete( "/users/:id",
        authenticateMiddleware( [ { "api_key": [] },{ "oauth2": [ "admin" ] } ] ),
        ...( fetchMiddlewares<RequestHandler>( UserController ) ),
        ...( fetchMiddlewares<RequestHandler>( UserController.prototype.deleteUser ) ),

        async function UserController_deleteUser( request: ExRequest, response: ExResponse, next: any ) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                id               : { "in": "path","name": "id","required": true,"ref": "AppModelIdT" },
                force            : { "in": "query","name": "force","dataType": "boolean" },
                notFoundResponse : { "in": "res","name": "404","required": true,"ref": "UserNotFoundResponseBody" },
                request          : { "in": "request","name": "request","dataType": "object" },
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = []
            try {
                validatedArgs = templateService.getValidatedArgs( { args, request, response } )

                const container: IocContainer = typeof iocContainer === "function" ? ( iocContainer as IocContainerFactory )( request ) : iocContainer

                const controller: any = await container.get<UserController>( UserController )
                if ( typeof controller.setStatus === "function" ) {
                    controller.setStatus( undefined )
                }

                await templateService.apiHandler( {
                    methodName    : "deleteUser",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus : undefined,
                } )
            } catch ( err ) {
                return next( err )
            }
        } )
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post( "/auth/login",
        ...( fetchMiddlewares<RequestHandler>( AuthController ) ),
        ...( fetchMiddlewares<RequestHandler>( AuthController.prototype.login ) ),

        async function AuthController_login( request: ExRequest, response: ExResponse, next: any ) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                username : { "in": "body-prop","name": "username","required": true,"dataType": "string" },
                password : { "in": "body-prop","name": "password","required": true,"dataType": "string" },
                _request : { "in": "request","name": "_request","dataType": "object" },
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = []
            try {
                validatedArgs = templateService.getValidatedArgs( { args, request, response } )

                const container: IocContainer = typeof iocContainer === "function" ? ( iocContainer as IocContainerFactory )( request ) : iocContainer

                const controller: any = await container.get<AuthController>( AuthController )
                if ( typeof controller.setStatus === "function" ) {
                    controller.setStatus( undefined )
                }

                await templateService.apiHandler( {
                    methodName    : "login",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus : undefined,
                } )
            } catch ( err ) {
                return next( err )
            }
        } )
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post( "/auth/register",
        ...( fetchMiddlewares<RequestHandler>( AuthController ) ),
        ...( fetchMiddlewares<RequestHandler>( AuthController.prototype.register ) ),

        async function AuthController_register( request: ExRequest, response: ExResponse, next: any ) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                user     : { "in": "body","name": "user","required": true,"ref": "AuthRegisterRequestBody" },
                _request : { "in": "request","name": "_request","dataType": "object" },
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = []
            try {
                validatedArgs = templateService.getValidatedArgs( { args, request, response } )

                const container: IocContainer = typeof iocContainer === "function" ? ( iocContainer as IocContainerFactory )( request ) : iocContainer

                const controller: any = await container.get<AuthController>( AuthController )
                if ( typeof controller.setStatus === "function" ) {
                    controller.setStatus( undefined )
                }

                await templateService.apiHandler( {
                    methodName    : "register",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus : undefined,
                } )
            } catch ( err ) {
                return next( err )
            }
        } )
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get( "/tags",
        authenticateMiddleware( [ { "api_key": [] },{ "oauth2": [ "admin","staff" ] } ] ),
        ...( fetchMiddlewares<RequestHandler>( TagController ) ),
        ...( fetchMiddlewares<RequestHandler>( TagController.prototype.getAllTags ) ),

        async function TagController_getAllTags( request: ExRequest, response: ExResponse, next: any ) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                offset           : { "in": "query","name": "offset","dataType": "double" },
                limit            : { "in": "query","name": "limit","dataType": "double" },
                orderBy          : { "in": "query","name": "orderBy","ref": "OrderByFieldValues" },
                filters          : { "in": "query","name": "filters","dataType": "string" },
                notFoundResponse : { "in": "res","name": "404","required": true,"ref": "TagNotFoundResponseBody" },
                request          : { "in": "request","name": "request","dataType": "object" },
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = []
            try {
                validatedArgs = templateService.getValidatedArgs( { args, request, response } )

                const container: IocContainer = typeof iocContainer === "function" ? ( iocContainer as IocContainerFactory )( request ) : iocContainer

                const controller: any = await container.get<TagController>( TagController )
                if ( typeof controller.setStatus === "function" ) {
                    controller.setStatus( undefined )
                }

                await templateService.apiHandler( {
                    methodName    : "getAllTags",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus : undefined,
                } )
            } catch ( err ) {
                return next( err )
            }
        } )
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get( "/tags/:id",
        authenticateMiddleware( [ { "api_key": [] },{ "oauth2": [ "admin","staff" ] } ] ),
        ...( fetchMiddlewares<RequestHandler>( TagController ) ),
        ...( fetchMiddlewares<RequestHandler>( TagController.prototype.getTag ) ),

        async function TagController_getTag( request: ExRequest, response: ExResponse, next: any ) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                id               : { "in": "path","name": "id","required": true,"ref": "AppModelIdT" },
                notFoundResponse : { "in": "res","name": "404","required": true,"ref": "TagNotFoundResponseBody" },
                request          : { "in": "request","name": "request","dataType": "object" },
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = []
            try {
                validatedArgs = templateService.getValidatedArgs( { args, request, response } )

                const container: IocContainer = typeof iocContainer === "function" ? ( iocContainer as IocContainerFactory )( request ) : iocContainer

                const controller: any = await container.get<TagController>( TagController )
                if ( typeof controller.setStatus === "function" ) {
                    controller.setStatus( undefined )
                }

                await templateService.apiHandler( {
                    methodName    : "getTag",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus : undefined,
                } )
            } catch ( err ) {
                return next( err )
            }
        } )
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post( "/tags",
        authenticateMiddleware( [ { "api_key": [] },{ "oauth2": [ "admin","staff" ] } ] ),
        ...( fetchMiddlewares<RequestHandler>( TagController ) ),
        ...( fetchMiddlewares<RequestHandler>( TagController.prototype.createTag ) ),

        async function TagController_createTag( request: ExRequest, response: ExResponse, next: any ) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                tag     : { "in": "body","name": "tag","required": true,"ref": "TagCreateRequest" },
                request : { "in": "request","name": "request","dataType": "object" },
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = []
            try {
                validatedArgs = templateService.getValidatedArgs( { args, request, response } )

                const container: IocContainer = typeof iocContainer === "function" ? ( iocContainer as IocContainerFactory )( request ) : iocContainer

                const controller: any = await container.get<TagController>( TagController )
                if ( typeof controller.setStatus === "function" ) {
                    controller.setStatus( undefined )
                }

                await templateService.apiHandler( {
                    methodName    : "createTag",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus : undefined,
                } )
            } catch ( err ) {
                return next( err )
            }
        } )
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.patch( "/tags/:id",
        authenticateMiddleware( [ { "api_key": [] },{ "oauth2": [ "admin","staff" ] } ] ),
        ...( fetchMiddlewares<RequestHandler>( TagController ) ),
        ...( fetchMiddlewares<RequestHandler>( TagController.prototype.updateTag ) ),

        async function TagController_updateTag( request: ExRequest, response: ExResponse, next: any ) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                id               : { "in": "path","name": "id","required": true,"ref": "AppModelIdT" },
                tag              : { "in": "body","name": "tag","required": true,"ref": "TagUpdateRequest" },
                notFoundResponse : { "in": "res","name": "404","required": true,"ref": "TagNotFoundResponseBody" },
                _request         : { "in": "request","name": "_request","required": true,"dataType": "object" },
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = []
            try {
                validatedArgs = templateService.getValidatedArgs( { args, request, response } )

                const container: IocContainer = typeof iocContainer === "function" ? ( iocContainer as IocContainerFactory )( request ) : iocContainer

                const controller: any = await container.get<TagController>( TagController )
                if ( typeof controller.setStatus === "function" ) {
                    controller.setStatus( undefined )
                }

                await templateService.apiHandler( {
                    methodName    : "updateTag",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus : undefined,
                } )
            } catch ( err ) {
                return next( err )
            }
        } )
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.delete( "/tags/:id",
        authenticateMiddleware( [ { "api_key": [] },{ "oauth2": [ "admin","staff" ] } ] ),
        ...( fetchMiddlewares<RequestHandler>( TagController ) ),
        ...( fetchMiddlewares<RequestHandler>( TagController.prototype.deleteTag ) ),

        async function TagController_deleteTag( request: ExRequest, response: ExResponse, next: any ) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                id               : { "in": "path","name": "id","required": true,"ref": "AppModelIdT" },
                force            : { "in": "query","name": "force","dataType": "boolean" },
                notFoundResponse : { "in": "res","name": "404","required": true,"ref": "TagNotFoundResponseBody" },
                request          : { "in": "request","name": "request","dataType": "object" },
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = []
            try {
                validatedArgs = templateService.getValidatedArgs( { args, request, response } )

                const container: IocContainer = typeof iocContainer === "function" ? ( iocContainer as IocContainerFactory )( request ) : iocContainer

                const controller: any = await container.get<TagController>( TagController )
                if ( typeof controller.setStatus === "function" ) {
                    controller.setStatus( undefined )
                }

                await templateService.apiHandler( {
                    methodName    : "deleteTag",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus : undefined,
                } )
            } catch ( err ) {
                return next( err )
            }
        } )
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get( "/roles",
        authenticateMiddleware( [ { "api_key": [] },{ "oauth2": [ "admin" ] } ] ),
        ...( fetchMiddlewares<RequestHandler>( RoleController ) ),
        ...( fetchMiddlewares<RequestHandler>( RoleController.prototype.getAllRoles ) ),

        async function RoleController_getAllRoles( request: ExRequest, response: ExResponse, next: any ) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                offset           : { "in": "query","name": "offset","dataType": "double" },
                limit            : { "in": "query","name": "limit","dataType": "double" },
                orderBy          : { "in": "query","name": "orderBy","ref": "OrderByFieldValues" },
                filters          : { "in": "query","name": "filters","dataType": "string" },
                notFoundResponse : { "in": "res","name": "404","required": true,"ref": "RoleNotFoundResponseBody" },
                request          : { "in": "request","name": "request","dataType": "object" },
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = []
            try {
                validatedArgs = templateService.getValidatedArgs( { args, request, response } )

                const container: IocContainer = typeof iocContainer === "function" ? ( iocContainer as IocContainerFactory )( request ) : iocContainer

                const controller: any = await container.get<RoleController>( RoleController )
                if ( typeof controller.setStatus === "function" ) {
                    controller.setStatus( undefined )
                }

                await templateService.apiHandler( {
                    methodName    : "getAllRoles",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus : undefined,
                } )
            } catch ( err ) {
                return next( err )
            }
        } )
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get( "/roles/:id",
        authenticateMiddleware( [ { "api_key": [] },{ "oauth2": [ "admin" ] } ] ),
        ...( fetchMiddlewares<RequestHandler>( RoleController ) ),
        ...( fetchMiddlewares<RequestHandler>( RoleController.prototype.getRole ) ),

        async function RoleController_getRole( request: ExRequest, response: ExResponse, next: any ) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                id               : { "in": "path","name": "id","required": true,"ref": "AppModelIdT" },
                notFoundResponse : { "in": "res","name": "404","required": true,"ref": "RoleNotFoundResponseBody" },
                request          : { "in": "request","name": "request","dataType": "object" },
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = []
            try {
                validatedArgs = templateService.getValidatedArgs( { args, request, response } )

                const container: IocContainer = typeof iocContainer === "function" ? ( iocContainer as IocContainerFactory )( request ) : iocContainer

                const controller: any = await container.get<RoleController>( RoleController )
                if ( typeof controller.setStatus === "function" ) {
                    controller.setStatus( undefined )
                }

                await templateService.apiHandler( {
                    methodName    : "getRole",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus : undefined,
                } )
            } catch ( err ) {
                return next( err )
            }
        } )
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post( "/roles",
        authenticateMiddleware( [ { "api_key": [] },{ "oauth2": [ "admin" ] } ] ),
        ...( fetchMiddlewares<RequestHandler>( RoleController ) ),
        ...( fetchMiddlewares<RequestHandler>( RoleController.prototype.createRole ) ),

        async function RoleController_createRole( request: ExRequest, response: ExResponse, next: any ) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                role    : { "in": "body","name": "role","required": true,"ref": "RoleCreateRequest" },
                request : { "in": "request","name": "request","dataType": "object" },
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = []
            try {
                validatedArgs = templateService.getValidatedArgs( { args, request, response } )

                const container: IocContainer = typeof iocContainer === "function" ? ( iocContainer as IocContainerFactory )( request ) : iocContainer

                const controller: any = await container.get<RoleController>( RoleController )
                if ( typeof controller.setStatus === "function" ) {
                    controller.setStatus( undefined )
                }

                await templateService.apiHandler( {
                    methodName    : "createRole",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus : undefined,
                } )
            } catch ( err ) {
                return next( err )
            }
        } )
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.patch( "/roles/:id",
        authenticateMiddleware( [ { "api_key": [] },{ "oauth2": [ "admin" ] } ] ),
        ...( fetchMiddlewares<RequestHandler>( RoleController ) ),
        ...( fetchMiddlewares<RequestHandler>( RoleController.prototype.updateRole ) ),

        async function RoleController_updateRole( request: ExRequest, response: ExResponse, next: any ) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                id               : { "in": "path","name": "id","required": true,"ref": "AppModelIdT" },
                role             : { "in": "body","name": "role","required": true,"ref": "RoleUpdateRequest" },
                notFoundResponse : { "in": "res","name": "404","required": true,"ref": "RoleNotFoundResponseBody" },
                _request         : { "in": "request","name": "_request","required": true,"dataType": "object" },
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = []
            try {
                validatedArgs = templateService.getValidatedArgs( { args, request, response } )

                const container: IocContainer = typeof iocContainer === "function" ? ( iocContainer as IocContainerFactory )( request ) : iocContainer

                const controller: any = await container.get<RoleController>( RoleController )
                if ( typeof controller.setStatus === "function" ) {
                    controller.setStatus( undefined )
                }

                await templateService.apiHandler( {
                    methodName    : "updateRole",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus : undefined,
                } )
            } catch ( err ) {
                return next( err )
            }
        } )
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.delete( "/roles/:id",
        authenticateMiddleware( [ { "api_key": [] },{ "oauth2": [ "admin" ] } ] ),
        ...( fetchMiddlewares<RequestHandler>( RoleController ) ),
        ...( fetchMiddlewares<RequestHandler>( RoleController.prototype.deleteRole ) ),

        async function RoleController_deleteRole( request: ExRequest, response: ExResponse, next: any ) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                id               : { "in": "path","name": "id","required": true,"ref": "AppModelIdT" },
                force            : { "in": "query","name": "force","dataType": "boolean" },
                notFoundResponse : { "in": "res","name": "404","required": true,"ref": "RoleNotFoundResponseBody" },
                request          : { "in": "request","name": "request","dataType": "object" },
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = []
            try {
                validatedArgs = templateService.getValidatedArgs( { args, request, response } )

                const container: IocContainer = typeof iocContainer === "function" ? ( iocContainer as IocContainerFactory )( request ) : iocContainer

                const controller: any = await container.get<RoleController>( RoleController )
                if ( typeof controller.setStatus === "function" ) {
                    controller.setStatus( undefined )
                }

                await templateService.apiHandler( {
                    methodName    : "deleteRole",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus : undefined,
                } )
            } catch ( err ) {
                return next( err )
            }
        } )
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get( "/feedbacks",
        ...( fetchMiddlewares<RequestHandler>( FeedbackController ) ),
        ...( fetchMiddlewares<RequestHandler>( FeedbackController.prototype.getAllFeedbacks ) ),

        async function FeedbackController_getAllFeedbacks( request: ExRequest, response: ExResponse, next: any ) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                offset           : { "in": "query","name": "offset","dataType": "double" },
                limit            : { "in": "query","name": "limit","dataType": "double" },
                orderBy          : { "in": "query","name": "orderBy","ref": "OrderByFieldValues" },
                filters          : { "in": "query","name": "filters","dataType": "string" },
                notFoundResponse : { "in": "res","name": "404","required": true,"ref": "FeedbackNotFoundResponseBody" },
                request          : { "in": "request","name": "request","dataType": "object" },
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = []
            try {
                validatedArgs = templateService.getValidatedArgs( { args, request, response } )

                const container: IocContainer = typeof iocContainer === "function" ? ( iocContainer as IocContainerFactory )( request ) : iocContainer

                const controller: any = await container.get<FeedbackController>( FeedbackController )
                if ( typeof controller.setStatus === "function" ) {
                    controller.setStatus( undefined )
                }

                await templateService.apiHandler( {
                    methodName    : "getAllFeedbacks",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus : undefined,
                } )
            } catch ( err ) {
                return next( err )
            }
        } )
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get( "/feedbacks/:id",
        ...( fetchMiddlewares<RequestHandler>( FeedbackController ) ),
        ...( fetchMiddlewares<RequestHandler>( FeedbackController.prototype.getFeedback ) ),

        async function FeedbackController_getFeedback( request: ExRequest, response: ExResponse, next: any ) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                id               : { "in": "path","name": "id","required": true,"ref": "AppModelIdT" },
                notFoundResponse : { "in": "res","name": "404","required": true,"ref": "FeedbackNotFoundResponseBody" },
                request          : { "in": "request","name": "request","dataType": "object" },
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = []
            try {
                validatedArgs = templateService.getValidatedArgs( { args, request, response } )

                const container: IocContainer = typeof iocContainer === "function" ? ( iocContainer as IocContainerFactory )( request ) : iocContainer

                const controller: any = await container.get<FeedbackController>( FeedbackController )
                if ( typeof controller.setStatus === "function" ) {
                    controller.setStatus( undefined )
                }

                await templateService.apiHandler( {
                    methodName    : "getFeedback",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus : undefined,
                } )
            } catch ( err ) {
                return next( err )
            }
        } )
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post( "/feedbacks",
        ...( fetchMiddlewares<RequestHandler>( FeedbackController ) ),
        ...( fetchMiddlewares<RequestHandler>( FeedbackController.prototype.createFeedback ) ),

        async function FeedbackController_createFeedback( request: ExRequest, response: ExResponse, next: any ) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                feedback : { "in": "body","name": "feedback","required": true,"ref": "FeedbackCreateRequest" },
                request  : { "in": "request","name": "request","dataType": "object" },
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = []
            try {
                validatedArgs = templateService.getValidatedArgs( { args, request, response } )

                const container: IocContainer = typeof iocContainer === "function" ? ( iocContainer as IocContainerFactory )( request ) : iocContainer

                const controller: any = await container.get<FeedbackController>( FeedbackController )
                if ( typeof controller.setStatus === "function" ) {
                    controller.setStatus( undefined )
                }

                await templateService.apiHandler( {
                    methodName    : "createFeedback",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus : undefined,
                } )
            } catch ( err ) {
                return next( err )
            }
        } )
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.patch( "/feedbacks/:id",
        ...( fetchMiddlewares<RequestHandler>( FeedbackController ) ),
        ...( fetchMiddlewares<RequestHandler>( FeedbackController.prototype.updateFeedback ) ),

        async function FeedbackController_updateFeedback( request: ExRequest, response: ExResponse, next: any ) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                id               : { "in": "path","name": "id","required": true,"ref": "AppModelIdT" },
                feedback         : { "in": "body","name": "feedback","required": true,"ref": "FeedbackUpdateRequest" },
                notFoundResponse : { "in": "res","name": "404","required": true,"ref": "FeedbackNotFoundResponseBody" },
                _request         : { "in": "request","name": "_request","required": true,"dataType": "object" },
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = []
            try {
                validatedArgs = templateService.getValidatedArgs( { args, request, response } )

                const container: IocContainer = typeof iocContainer === "function" ? ( iocContainer as IocContainerFactory )( request ) : iocContainer

                const controller: any = await container.get<FeedbackController>( FeedbackController )
                if ( typeof controller.setStatus === "function" ) {
                    controller.setStatus( undefined )
                }

                await templateService.apiHandler( {
                    methodName    : "updateFeedback",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus : undefined,
                } )
            } catch ( err ) {
                return next( err )
            }
        } )
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.delete( "/feedbacks/:id",
        authenticateMiddleware( [ { "api_key": [] },{ "oauth2": [ "admin" ] } ] ),
        ...( fetchMiddlewares<RequestHandler>( FeedbackController ) ),
        ...( fetchMiddlewares<RequestHandler>( FeedbackController.prototype.deleteFeedback ) ),

        async function FeedbackController_deleteFeedback( request: ExRequest, response: ExResponse, next: any ) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                id               : { "in": "path","name": "id","required": true,"ref": "AppModelIdT" },
                force            : { "in": "query","name": "force","dataType": "boolean" },
                notFoundResponse : { "in": "res","name": "404","required": true,"ref": "FeedbackNotFoundResponseBody" },
                request          : { "in": "request","name": "request","dataType": "object" },
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = []
            try {
                validatedArgs = templateService.getValidatedArgs( { args, request, response } )

                const container: IocContainer = typeof iocContainer === "function" ? ( iocContainer as IocContainerFactory )( request ) : iocContainer

                const controller: any = await container.get<FeedbackController>( FeedbackController )
                if ( typeof controller.setStatus === "function" ) {
                    controller.setStatus( undefined )
                }

                await templateService.apiHandler( {
                    methodName    : "deleteFeedback",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus : undefined,
                } )
            } catch ( err ) {
                return next( err )
            }
        } )
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get( "/bookingTypes",
        ...( fetchMiddlewares<RequestHandler>( BookingTypeController ) ),
        ...( fetchMiddlewares<RequestHandler>( BookingTypeController.prototype.getAllBookingTypes ) ),

        async function BookingTypeController_getAllBookingTypes( request: ExRequest, response: ExResponse, next: any ) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                offset           : { "in": "query","name": "offset","dataType": "double" },
                limit            : { "in": "query","name": "limit","dataType": "double" },
                orderBy          : { "in": "query","name": "orderBy","ref": "OrderByFieldValues" },
                filters          : { "in": "query","name": "filters","dataType": "string" },
                notFoundResponse : { "in": "res","name": "404","required": true,"ref": "BookingTypeNotFoundResponseBody" },
                request          : { "in": "request","name": "request","dataType": "object" },
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = []
            try {
                validatedArgs = templateService.getValidatedArgs( { args, request, response } )

                const container: IocContainer = typeof iocContainer === "function" ? ( iocContainer as IocContainerFactory )( request ) : iocContainer

                const controller: any = await container.get<BookingTypeController>( BookingTypeController )
                if ( typeof controller.setStatus === "function" ) {
                    controller.setStatus( undefined )
                }

                await templateService.apiHandler( {
                    methodName    : "getAllBookingTypes",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus : undefined,
                } )
            } catch ( err ) {
                return next( err )
            }
        } )
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get( "/bookingTypes/:id",
        ...( fetchMiddlewares<RequestHandler>( BookingTypeController ) ),
        ...( fetchMiddlewares<RequestHandler>( BookingTypeController.prototype.getBookingType ) ),

        async function BookingTypeController_getBookingType( request: ExRequest, response: ExResponse, next: any ) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                id               : { "in": "path","name": "id","required": true,"ref": "AppModelIdT" },
                notFoundResponse : { "in": "res","name": "404","required": true,"ref": "BookingTypeNotFoundResponseBody" },
                request          : { "in": "request","name": "request","dataType": "object" },
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = []
            try {
                validatedArgs = templateService.getValidatedArgs( { args, request, response } )

                const container: IocContainer = typeof iocContainer === "function" ? ( iocContainer as IocContainerFactory )( request ) : iocContainer

                const controller: any = await container.get<BookingTypeController>( BookingTypeController )
                if ( typeof controller.setStatus === "function" ) {
                    controller.setStatus( undefined )
                }

                await templateService.apiHandler( {
                    methodName    : "getBookingType",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus : undefined,
                } )
            } catch ( err ) {
                return next( err )
            }
        } )
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post( "/bookingTypes",
        authenticateMiddleware( [ { "api_key": [] },{ "oauth2": [ "user" ] } ] ),
        ...( fetchMiddlewares<RequestHandler>( BookingTypeController ) ),
        ...( fetchMiddlewares<RequestHandler>( BookingTypeController.prototype.createBookingType ) ),

        async function BookingTypeController_createBookingType( request: ExRequest, response: ExResponse, next: any ) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                bookingType : { "in": "body","name": "bookingType","required": true,"ref": "BookingTypeCreateRequest" },
                request     : { "in": "request","name": "request","dataType": "object" },
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = []
            try {
                validatedArgs = templateService.getValidatedArgs( { args, request, response } )

                const container: IocContainer = typeof iocContainer === "function" ? ( iocContainer as IocContainerFactory )( request ) : iocContainer

                const controller: any = await container.get<BookingTypeController>( BookingTypeController )
                if ( typeof controller.setStatus === "function" ) {
                    controller.setStatus( undefined )
                }

                await templateService.apiHandler( {
                    methodName    : "createBookingType",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus : undefined,
                } )
            } catch ( err ) {
                return next( err )
            }
        } )
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.patch( "/bookingTypes/:id",
        authenticateMiddleware( [ { "api_key": [] },{ "oauth2": [ "user" ] } ] ),
        ...( fetchMiddlewares<RequestHandler>( BookingTypeController ) ),
        ...( fetchMiddlewares<RequestHandler>( BookingTypeController.prototype.updateBookingType ) ),

        async function BookingTypeController_updateBookingType( request: ExRequest, response: ExResponse, next: any ) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                id               : { "in": "path","name": "id","required": true,"ref": "AppModelIdT" },
                bookingType      : { "in": "body","name": "bookingType","required": true,"ref": "BookingTypeUpdateRequest" },
                notFoundResponse : { "in": "res","name": "404","required": true,"ref": "BookingTypeNotFoundResponseBody" },
                _request         : { "in": "request","name": "_request","required": true,"dataType": "object" },
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = []
            try {
                validatedArgs = templateService.getValidatedArgs( { args, request, response } )

                const container: IocContainer = typeof iocContainer === "function" ? ( iocContainer as IocContainerFactory )( request ) : iocContainer

                const controller: any = await container.get<BookingTypeController>( BookingTypeController )
                if ( typeof controller.setStatus === "function" ) {
                    controller.setStatus( undefined )
                }

                await templateService.apiHandler( {
                    methodName    : "updateBookingType",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus : undefined,
                } )
            } catch ( err ) {
                return next( err )
            }
        } )
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.delete( "/bookingTypes/:id",
        authenticateMiddleware( [ { "api_key": [] },{ "oauth2": [ "user" ] } ] ),
        ...( fetchMiddlewares<RequestHandler>( BookingTypeController ) ),
        ...( fetchMiddlewares<RequestHandler>( BookingTypeController.prototype.deleteBookingType ) ),

        async function BookingTypeController_deleteBookingType( request: ExRequest, response: ExResponse, next: any ) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                id               : { "in": "path","name": "id","required": true,"ref": "AppModelIdT" },
                force            : { "in": "query","name": "force","dataType": "boolean" },
                notFoundResponse : { "in": "res","name": "404","required": true,"ref": "BookingTypeNotFoundResponseBody" },
                request          : { "in": "request","name": "request","dataType": "object" },
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = []
            try {
                validatedArgs = templateService.getValidatedArgs( { args, request, response } )

                const container: IocContainer = typeof iocContainer === "function" ? ( iocContainer as IocContainerFactory )( request ) : iocContainer

                const controller: any = await container.get<BookingTypeController>( BookingTypeController )
                if ( typeof controller.setStatus === "function" ) {
                    controller.setStatus( undefined )
                }

                await templateService.apiHandler( {
                    methodName    : "deleteBookingType",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus : undefined,
                } )
            } catch ( err ) {
                return next( err )
            }
        } )
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get( "/bookings",
        authenticateMiddleware( [ { "api_key": [] },{ "oauth2": [ "user" ] } ] ),
        ...( fetchMiddlewares<RequestHandler>( BookingController ) ),
        ...( fetchMiddlewares<RequestHandler>( BookingController.prototype.getAllBookings ) ),

        async function BookingController_getAllBookings( request: ExRequest, response: ExResponse, next: any ) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                offset           : { "in": "query","name": "offset","dataType": "double" },
                limit            : { "in": "query","name": "limit","dataType": "double" },
                orderBy          : { "in": "query","name": "orderBy","ref": "OrderByFieldValues" },
                filters          : { "in": "query","name": "filters","dataType": "string" },
                notFoundResponse : { "in": "res","name": "404","required": true,"ref": "BookingNotFoundResponseBody" },
                request          : { "in": "request","name": "request","dataType": "object" },
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = []
            try {
                validatedArgs = templateService.getValidatedArgs( { args, request, response } )

                const container: IocContainer = typeof iocContainer === "function" ? ( iocContainer as IocContainerFactory )( request ) : iocContainer

                const controller: any = await container.get<BookingController>( BookingController )
                if ( typeof controller.setStatus === "function" ) {
                    controller.setStatus( undefined )
                }

                await templateService.apiHandler( {
                    methodName    : "getAllBookings",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus : undefined,
                } )
            } catch ( err ) {
                return next( err )
            }
        } )
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get( "/bookings/:id",
        authenticateMiddleware( [ { "api_key": [] },{ "oauth2": [ "user" ] } ] ),
        ...( fetchMiddlewares<RequestHandler>( BookingController ) ),
        ...( fetchMiddlewares<RequestHandler>( BookingController.prototype.getBooking ) ),

        async function BookingController_getBooking( request: ExRequest, response: ExResponse, next: any ) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                id               : { "in": "path","name": "id","required": true,"ref": "AppModelIdT" },
                notFoundResponse : { "in": "res","name": "404","required": true,"ref": "BookingNotFoundResponseBody" },
                request          : { "in": "request","name": "request","dataType": "object" },
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = []
            try {
                validatedArgs = templateService.getValidatedArgs( { args, request, response } )

                const container: IocContainer = typeof iocContainer === "function" ? ( iocContainer as IocContainerFactory )( request ) : iocContainer

                const controller: any = await container.get<BookingController>( BookingController )
                if ( typeof controller.setStatus === "function" ) {
                    controller.setStatus( undefined )
                }

                await templateService.apiHandler( {
                    methodName    : "getBooking",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus : undefined,
                } )
            } catch ( err ) {
                return next( err )
            }
        } )
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post( "/bookings",
        authenticateMiddleware( [ { "api_key": [] },{ "oauth2": [ "user" ] } ] ),
        ...( fetchMiddlewares<RequestHandler>( BookingController ) ),
        ...( fetchMiddlewares<RequestHandler>( BookingController.prototype.createBooking ) ),

        async function BookingController_createBooking( request: ExRequest, response: ExResponse, next: any ) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                booking : { "in": "body","name": "booking","required": true,"ref": "BookingCreateRequest" },
                request : { "in": "request","name": "request","dataType": "object" },
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = []
            try {
                validatedArgs = templateService.getValidatedArgs( { args, request, response } )

                const container: IocContainer = typeof iocContainer === "function" ? ( iocContainer as IocContainerFactory )( request ) : iocContainer

                const controller: any = await container.get<BookingController>( BookingController )
                if ( typeof controller.setStatus === "function" ) {
                    controller.setStatus( undefined )
                }

                await templateService.apiHandler( {
                    methodName    : "createBooking",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus : undefined,
                } )
            } catch ( err ) {
                return next( err )
            }
        } )
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.patch( "/bookings/:id",
        authenticateMiddleware( [ { "api_key": [] },{ "oauth2": [ "user" ] } ] ),
        ...( fetchMiddlewares<RequestHandler>( BookingController ) ),
        ...( fetchMiddlewares<RequestHandler>( BookingController.prototype.updateBooking ) ),

        async function BookingController_updateBooking( request: ExRequest, response: ExResponse, next: any ) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                id               : { "in": "path","name": "id","required": true,"ref": "AppModelIdT" },
                booking          : { "in": "body","name": "booking","required": true,"ref": "BookingUpdateRequest" },
                notFoundResponse : { "in": "res","name": "404","required": true,"ref": "BookingNotFoundResponseBody" },
                _request         : { "in": "request","name": "_request","required": true,"dataType": "object" },
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = []
            try {
                validatedArgs = templateService.getValidatedArgs( { args, request, response } )

                const container: IocContainer = typeof iocContainer === "function" ? ( iocContainer as IocContainerFactory )( request ) : iocContainer

                const controller: any = await container.get<BookingController>( BookingController )
                if ( typeof controller.setStatus === "function" ) {
                    controller.setStatus( undefined )
                }

                await templateService.apiHandler( {
                    methodName    : "updateBooking",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus : undefined,
                } )
            } catch ( err ) {
                return next( err )
            }
        } )
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.delete( "/bookings/:id",
        authenticateMiddleware( [ { "api_key": [] },{ "oauth2": [ "user" ] } ] ),
        ...( fetchMiddlewares<RequestHandler>( BookingController ) ),
        ...( fetchMiddlewares<RequestHandler>( BookingController.prototype.deleteBooking ) ),

        async function BookingController_deleteBooking( request: ExRequest, response: ExResponse, next: any ) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                id               : { "in": "path","name": "id","required": true,"ref": "AppModelIdT" },
                force            : { "in": "query","name": "force","dataType": "boolean" },
                notFoundResponse : { "in": "res","name": "404","required": true,"ref": "BookingNotFoundResponseBody" },
                request          : { "in": "request","name": "request","dataType": "object" },
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = []
            try {
                validatedArgs = templateService.getValidatedArgs( { args, request, response } )

                const container: IocContainer = typeof iocContainer === "function" ? ( iocContainer as IocContainerFactory )( request ) : iocContainer

                const controller: any = await container.get<BookingController>( BookingController )
                if ( typeof controller.setStatus === "function" ) {
                    controller.setStatus( undefined )
                }

                await templateService.apiHandler( {
                    methodName    : "deleteBooking",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus : undefined,
                } )
            } catch ( err ) {
                return next( err )
            }
        } )
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get( "/blogs",
        ...( fetchMiddlewares<RequestHandler>( BlogController ) ),
        ...( fetchMiddlewares<RequestHandler>( BlogController.prototype.getAllBlogs ) ),

        async function BlogController_getAllBlogs( request: ExRequest, response: ExResponse, next: any ) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                offset           : { "in": "query","name": "offset","dataType": "double" },
                limit            : { "in": "query","name": "limit","dataType": "double" },
                orderBy          : { "in": "query","name": "orderBy","ref": "OrderByFieldValues" },
                filters          : { "in": "query","name": "filters","dataType": "string" },
                notFoundResponse : { "in": "res","name": "404","required": true,"ref": "BlogNotFoundResponseBody" },
                request          : { "in": "request","name": "request","dataType": "object" },
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = []
            try {
                validatedArgs = templateService.getValidatedArgs( { args, request, response } )

                const container: IocContainer = typeof iocContainer === "function" ? ( iocContainer as IocContainerFactory )( request ) : iocContainer

                const controller: any = await container.get<BlogController>( BlogController )
                if ( typeof controller.setStatus === "function" ) {
                    controller.setStatus( undefined )
                }

                await templateService.apiHandler( {
                    methodName    : "getAllBlogs",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus : undefined,
                } )
            } catch ( err ) {
                return next( err )
            }
        } )
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get( "/blogs/:id",
        ...( fetchMiddlewares<RequestHandler>( BlogController ) ),
        ...( fetchMiddlewares<RequestHandler>( BlogController.prototype.getBlog ) ),

        async function BlogController_getBlog( request: ExRequest, response: ExResponse, next: any ) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                id               : { "in": "path","name": "id","required": true,"ref": "AppModelIdT" },
                notFoundResponse : { "in": "res","name": "404","required": true,"ref": "BlogNotFoundResponseBody" },
                request          : { "in": "request","name": "request","dataType": "object" },
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = []
            try {
                validatedArgs = templateService.getValidatedArgs( { args, request, response } )

                const container: IocContainer = typeof iocContainer === "function" ? ( iocContainer as IocContainerFactory )( request ) : iocContainer

                const controller: any = await container.get<BlogController>( BlogController )
                if ( typeof controller.setStatus === "function" ) {
                    controller.setStatus( undefined )
                }

                await templateService.apiHandler( {
                    methodName    : "getBlog",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus : undefined,
                } )
            } catch ( err ) {
                return next( err )
            }
        } )
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post( "/blogs",
        authenticateMiddleware( [ { "api_key": [] },{ "oauth2": [ "admin","staff" ] } ] ),
        ...( fetchMiddlewares<RequestHandler>( BlogController ) ),
        ...( fetchMiddlewares<RequestHandler>( BlogController.prototype.createBlog ) ),

        async function BlogController_createBlog( request: ExRequest, response: ExResponse, next: any ) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                blog    : { "in": "body","name": "blog","required": true,"ref": "BlogCreateRequest" },
                request : { "in": "request","name": "request","dataType": "object" },
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = []
            try {
                validatedArgs = templateService.getValidatedArgs( { args, request, response } )

                const container: IocContainer = typeof iocContainer === "function" ? ( iocContainer as IocContainerFactory )( request ) : iocContainer

                const controller: any = await container.get<BlogController>( BlogController )
                if ( typeof controller.setStatus === "function" ) {
                    controller.setStatus( undefined )
                }

                await templateService.apiHandler( {
                    methodName    : "createBlog",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus : undefined,
                } )
            } catch ( err ) {
                return next( err )
            }
        } )
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.patch( "/blogs/:id",
        authenticateMiddleware( [ { "api_key": [] },{ "oauth2": [ "admin","staff" ] } ] ),
        ...( fetchMiddlewares<RequestHandler>( BlogController ) ),
        ...( fetchMiddlewares<RequestHandler>( BlogController.prototype.updateBlog ) ),

        async function BlogController_updateBlog( request: ExRequest, response: ExResponse, next: any ) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                id               : { "in": "path","name": "id","required": true,"ref": "AppModelIdT" },
                blog             : { "in": "body","name": "blog","required": true,"ref": "BlogUpdateRequest" },
                notFoundResponse : { "in": "res","name": "404","required": true,"ref": "BlogNotFoundResponseBody" },
                _request         : { "in": "request","name": "_request","required": true,"dataType": "object" },
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = []
            try {
                validatedArgs = templateService.getValidatedArgs( { args, request, response } )

                const container: IocContainer = typeof iocContainer === "function" ? ( iocContainer as IocContainerFactory )( request ) : iocContainer

                const controller: any = await container.get<BlogController>( BlogController )
                if ( typeof controller.setStatus === "function" ) {
                    controller.setStatus( undefined )
                }

                await templateService.apiHandler( {
                    methodName    : "updateBlog",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus : undefined,
                } )
            } catch ( err ) {
                return next( err )
            }
        } )
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.delete( "/blogs/:id",
        authenticateMiddleware( [ { "api_key": [] },{ "oauth2": [ "admin","staff" ] } ] ),
        ...( fetchMiddlewares<RequestHandler>( BlogController ) ),
        ...( fetchMiddlewares<RequestHandler>( BlogController.prototype.deleteBlog ) ),

        async function BlogController_deleteBlog( request: ExRequest, response: ExResponse, next: any ) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                id               : { "in": "path","name": "id","required": true,"ref": "AppModelIdT" },
                force            : { "in": "query","name": "force","dataType": "boolean" },
                notFoundResponse : { "in": "res","name": "404","required": true,"ref": "BlogNotFoundResponseBody" },
                request          : { "in": "request","name": "request","dataType": "object" },
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = []
            try {
                validatedArgs = templateService.getValidatedArgs( { args, request, response } )

                const container: IocContainer = typeof iocContainer === "function" ? ( iocContainer as IocContainerFactory )( request ) : iocContainer

                const controller: any = await container.get<BlogController>( BlogController )
                if ( typeof controller.setStatus === "function" ) {
                    controller.setStatus( undefined )
                }

                await templateService.apiHandler( {
                    methodName    : "deleteBlog",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus : undefined,
                } )
            } catch ( err ) {
                return next( err )
            }
        } )
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function authenticateMiddleware( security: TsoaRoute.Security[] = [] ) {
        return async function runAuthenticationMiddleware( request: any, response: any, next: any ) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            // keep track of failed auth attempts so we can hand back the most
            // recent one.  This behavior was previously existing so preserving it
            // here
            const failedAttempts: any[] = []
            const pushAndRethrow = ( error: any ) => {
                failedAttempts.push( error )
                throw error
            }

            const secMethodOrPromises: Array<Promise<any>> = []
            for ( const secMethod of security ) {
                if ( Object.keys( secMethod ).length > 1 ) {
                    const secMethodAndPromises: Array<Promise<any>> = []

                    for ( const name in secMethod ) {
                        secMethodAndPromises.push(
                            expressAuthenticationRecasted( request, name, secMethod[ name ], response )
                                .catch( pushAndRethrow )
                        )
                    }

                    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                    secMethodOrPromises.push( Promise.all( secMethodAndPromises )
                        .then( users => { return users[ 0 ] } ) )
                } else {
                    for ( const name in secMethod ) {
                        secMethodOrPromises.push(
                            expressAuthenticationRecasted( request, name, secMethod[ name ], response )
                                .catch( pushAndRethrow )
                        )
                    }
                }
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            try {
                request.user = await Promise.any( secMethodOrPromises )

                // Response was sent in middleware, abort
                if ( response.writableEnded ) {
                    return
                }

                next()
            }
            catch( err ) {
                // Show most recent error as response
                const error = failedAttempts.pop()
                error.status = error.status || 401

                // Response was sent in middleware, abort
                if ( response.writableEnded ) {
                    return
                }
                next( error )
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
