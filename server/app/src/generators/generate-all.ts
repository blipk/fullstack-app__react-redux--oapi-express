/**
 * This file runs all the generators in the required order
 *
 * @module
 */

import { shutdownDB } from "../data/connector.ts"
import convertAllDBModelsToValidatorModels from "./class-validator-generator.ts"
import { generateClient } from "./api-client-generator.ts"
import { generateControllersDefaults } from "./controllers-generator.ts"
import generateTSOA from "./tsoa-generator.ts"

interface GenerateAllOptions {
    includeModels?: boolean,
    includeControllers?: boolean,
    includeTSOA?: boolean,
    includeClient?: boolean
}

const defaultGenerateAllOptions: GenerateAllOptions = {
    includeModels      : true,
    includeControllers : true,
    includeTSOA        : true,
    includeClient      : true
}

const generateAll = async(
    options?: GenerateAllOptions
): Promise<void> => {
    options = { ...defaultGenerateAllOptions, ...options }

    if ( options.includeModels )
        await convertAllDBModelsToValidatorModels( false )

    console.warn( "----" )

    if ( options.includeControllers )
        await generateControllersDefaults( false )

    console.warn( "----" )

    if ( options.includeTSOA )
        await generateTSOA()

    console.warn( "----" )

    if ( options.includeClient )
        await generateClient()
}

const isRunDirectly = import.meta.filename.includes( process.argv[ 1 ] )
if ( isRunDirectly ) {
    await generateAll()
    await shutdownDB()
}

export { generateAll }
export type { GenerateAllOptions }