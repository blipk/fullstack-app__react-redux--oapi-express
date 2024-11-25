/**
 * @deprecated Use {@link generators/class-validator-generator} instead.
 *
 * This file generates and exports OpenAPI schemas from the application sequelize models.
 * These schemas are used by the express server for route input validation,
 * @module
 */
import { connectDB } from "../../data/connector.ts"
import type { ModelStatic } from "@sequelize/core"
import { allModels } from "../../data/models/models.ts"

await connectDB()

interface OpenApiSchema {
  type: string;
  properties: Record<string, OpenApiProperty>;
  required?: string[];
}

interface OpenApiProperty {
  type: string;
  format?: string;
}

/**
 * This function takes an array of sequelize models and generates OpenAPI schemas for them
 *
 * @param models - The array of sequelize models to initialize
 * @returns A records object with the keys as the model name and the values as the OpenAPI schema for the model
 */
const generateOpenApiSchema = ( models: ModelStatic[] ): Record<string, OpenApiSchema> => {

    const schemas: Record<string, OpenApiSchema> = {}

    models.forEach( ( model ) => {
        const modelName = model.modelDefinition.modelName

        const modelSchema: OpenApiSchema = {
            type       : "object",
            properties : {},
            required   : [],
        }

        for ( const attribute of model.modelDefinition.attributes.values() ) {
            const attributeName = attribute.attributeName
            const type = attribute.type.constructor.name.toLowerCase()

            modelSchema.properties[ attributeName ] = { type: mapSequelizeTypeToOpenApiType( type ) }

            if ( !attribute.allowNull ) {
                modelSchema.required?.push( attributeName )
            }
        }

        schemas[ modelName ] = modelSchema
    } )

    return schemas
}

const mapSequelizeTypeToOpenApiType = ( sequelizeType: string ): string => {
    switch ( sequelizeType ) {
    case "string":
        return "string"
    case "text":
        return "string"
    case "integer":
        return "integer"
    case "float":
    case "double":
    case "real":
        return "number"
    case "boolean":
        return "boolean"
    case "date":
    case "datetime":
        return "string"
    default:
        return "string" // Default type
    }
}

const generatedSchemas = allModels.map( model => generateOpenApiSchema( [ model ] ) )

export { generateOpenApiSchema, generatedSchemas }
export type { OpenApiSchema, OpenApiProperty }