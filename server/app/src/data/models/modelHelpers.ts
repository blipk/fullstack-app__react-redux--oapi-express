// Some model helper functions from here: https://sequelize.org/docs/v7/other-topics/utility-types/

import type {
    Model,
    ModelStatic,
    NormalizedAttributeOptions,
    Attributes
} from "@sequelize/core"


export function getPrimaryKeyAttributes( model: ModelStatic<never> ): NormalizedAttributeOptions[] {
    const attributes: NormalizedAttributeOptions[] = []

    for ( const attribute of model.modelDefinition.attributes.values() ) {
        if ( attribute.primaryKey ) {
            attributes.push( attribute )
        }
    }

    return attributes
}

export function getAttributeMetadata<M extends Model>(
    model: ModelStatic<M>,
    attributeName: keyof Attributes<M>,
): NormalizedAttributeOptions {
    const attribute = model.modelDefinition.attributes.get( String( attributeName ) )
    if ( !attribute ) {
        throw new Error( `Attribute ${String( attributeName )} does not exist on model ${model.name}` )
    }

    return attribute
}