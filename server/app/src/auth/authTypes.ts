/**
 * This file contains some types related to auth
 * @module
 */

import type { InferAttributes } from "@sequelize/core"
import type { JwtPayload, SignOptions } from "jsonwebtoken"

import type { UserModel } from "../data/models/authModels.ts"



/** The types of auth security supported */
enum SecurityTypes {
    API_KEY = "api_key",
    OAuth2 = "oauth2"
}

/** The supported scopes for {@link SecurityTypes.OAuth2} */
enum SecurityScope {
    ADMIN = "admin",
    STAFF = "staff",
    USER = "user"
}

/** Groups of {@link SecurityTypes} that are passed to the `tsoa` `@Security` decorator */
// : Record<keyof typeof SecurityScope, SecurityScope[]> // If I add this typing then tsoa refuses to add the scopes to the spec
const securityScopeGroups = {
    "ADMIN" : [ SecurityScope.ADMIN ],
    "STAFF" : [ SecurityScope.ADMIN, SecurityScope.STAFF ],
    "USER"  : [ SecurityScope.USER ],
}



/** This is our applications JWT payload schema */
interface AppJWTPayload extends JwtPayload {
    user?: InferAttributes<UserModel> // Have this as undefined as possibly undefined as we should check it in some security scenarios
    scopes: SecurityScope[]
}

/** Represents a JWT SignOptions that always has an expiresIn */
type SignOptionsWithExpiresIn = SignOptions & { expiresIn: string | number }

/** Represents a created encoded JWT with the signing options it was created with, returned by {@link auth/authHelper.AuthHelper.createJWT} */
interface EncodedJWTWithDetails {
    jwt: string,
    jwtSignOptions: SignOptionsWithExpiresIn
}

export {
    SecurityScope, SecurityTypes, securityScopeGroups
}

export type {
    AppJWTPayload, EncodedJWTWithDetails, SignOptionsWithExpiresIn
}