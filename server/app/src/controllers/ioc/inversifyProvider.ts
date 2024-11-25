/**
 * This file contains decorators for inversion of control via constructor dependency injection for TSOA controllers
 *
 * The decorators methods below declare classes as providers and must be used on BOTH sides of the provision
 *
 * The class using the decorator is provided as the decorator argument.
 *
 * The `@inject` decorator is then used in the constructor like below:
 * ```
 *  constructor(
 *       @inject( AuthService ) authService: AuthService
 *   ) {
 *       super()
 *       this.authService = authService
 *   }
 * ```
 *
 * @remarks Adapted from the TSOA guide here: https://tsoa-community.github.io/docs/di.html
 * @module
 */
import { fluentProvide } from "inversify-binding-decorators"
import { inject } from "inversify"
import type { interfaces } from "inversify"


const provideSingleton = function <T>(
    identifier: interfaces.ServiceIdentifier<T>
): ClassDecorator {
    // Injects a singleton controller instance
    return fluentProvide( identifier ).inSingletonScope().done()
}

const provide = function <T>(
    identifier: interfaces.ServiceIdentifier<T>
): ClassDecorator {
    // Injects a new controller instance per call
    return fluentProvide( identifier ).inTransientScope().done()
}


export { provideSingleton, provide, inject }