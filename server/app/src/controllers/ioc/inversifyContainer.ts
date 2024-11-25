/**
 * This file helps set up inversion of control via constructor dependency injection using InversifyJS
 *
 * It declares the InversifyJS container and makes the tsoa controllers injectable
 *
 * This file must be defined in `tsoa.json` in the `routes.iocModule` property
 *
 * @remarks Adapted from the guide here: https://tsoa-community.github.io/docs/di.html
 * @module
 */


import { Container, decorate, injectable } from "inversify"
import { buildProviderModule } from "inversify-binding-decorators"
import { Controller } from "tsoa"

// Create a new container tsoa can use
const iocContainer = new Container()

decorate( injectable(), Controller ) // Makes tsoa's Controller injectable

// make inversify aware of inversify-binding-decorators
iocContainer.load( buildProviderModule() )

// export according to convention
export { iocContainer }