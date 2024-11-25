/**
 * This file contains the root/base `AppModel` that all our application models inherit from
 * @module
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    InferAttributesOptions,
    NonAttribute,
    FindOptions,
    Attributes,
} from "@sequelize/core"
import {
    Model,
    DataTypes
} from "@sequelize/core"

import {
    Table,
    Attribute,
    PrimaryKey,
    AutoIncrement,
    NotNull,
    Default,
    ModelValidator,
    Index,
    Unique,
    createIndexDecorator,
    DeletedAt,
    HasMany,
    BelongsToMany,
} from "@sequelize/core/decorators-legacy"
import { ArrayContains } from "class-validator"
/* eslint-enable @typescript-eslint/no-unused-vars */


// https://sequelize.org/api/v7/modules/_sequelize_core.decorators_legacy.html
// https://sequelize.org/docs/v7/models/validations-and-constraints/

/** All the models for this file (that inherit AppModel) will belong to this schema */
const modelsSchema = "public"

/** This is the type of {@link AppModel.id} - used to ensure its correct when used in routers etc. */
type AppModelIdT = number


/**
 * AppModel is the base model that all our database models inherit from
 *
 * It is a wrapper around Sequelize's `Model` class and its Infer*Attributes generics,
 * which define the models attributes and creation attributes.
 *
 * This wrapper also helps provide typing for shared generated fields,
 * as well as some virtual properties that can be overridden for application specific behaviours
 *
 */
@Table.Abstract( { "schema": modelsSchema } )
class AppModel<
        TModelClass extends Model,
        TModelAttributes extends InferAttributes<TModelClass> = InferAttributes<TModelClass>,
        TModelCreattionAttrs extends InferCreationAttributes<TModelClass> = InferCreationAttributes<TModelClass>
    >
    extends Model<
        TModelAttributes,
        TModelCreattionAttrs
    > {

    // Sequalize creates this by default on all models (if I don't use @PrimaryKey)
    // I'm doing this here incase I want to tweak it
    /** The unique identifier of the model */
    @Attribute( DataTypes.INTEGER )
    @PrimaryKey
    @AutoIncrement
    declare id: CreationOptional<AppModelIdT> // ID is optional on creation as it is set to AutoIncrement

    // I will just use the above for now but leaving this here for the future reference as it may be useful
    // @Attribute( DataTypes.UUIDV4 )
    // @Default(() => uuidv4())         // This is done in JS
    // @Default(sql.fn('sql.uuidV4'))   // DB functions that sequelize provides but only for MariaDB/MySQL/MSSQL - defaults to JS for others
    // declare uuid: CreationOptional<string>;

    // Enable soft deletion by default
    // this will be set when using Model.destroy(),
    // for a hard deletion use Model.destroy({force: true})
    // To undo soft deletion, use the Model.restore() method
    // To include soft deleted records in a find operation use the { paranoid: false } option
    @DeletedAt
    declare deletedAt?: CreationOptional<Date>

    // These are autogenerated by sequelize, we add them here so we have ts typing for them
    declare createdAt: CreationOptional<Date>
    declare updatedAt?: CreationOptional<Date>


    /**
     * Optionally overridden by each subclass and used in {@link data/connector/establishModelScopes}
     * to established the models scopes for sequelize's finder methods.
     *
     * The record key is the name of the scope, the value is the FindOptions for the scope.
     *
     * Use the `defaultScope` key for global use in the default finder methods
     */
    declare static establishScopes?: NonAttribute<Record<string, FindOptions>>


    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
    override toJSON<T extends TModelAttributes = TModelAttributes>(): T {
        const values = Object.assign( {}, this.get() ) // This fixes problems with TSOA

        // This fixes issue with Sequelize's `toJSON` method not calling it on included associated models
        const recursiveToJSON = ( object: Record<string, unknown> ): Record<string, unknown> => {
            interface ValueWithToJSONMethod { toJSON: () => Record<string, unknown> }

            return Object.fromEntries(
                Object.entries( object )
                    .map( ( [ key, value ] ) => {
                        const newValue =
                            value
                            && ( ( value instanceof AppModel ) || ( value instanceof Model ) )
                            && ( value as Partial<ValueWithToJSONMethod> ).toJSON
                                ? recursiveToJSON( ( value as ValueWithToJSONMethod ).toJSON() )
                                : Array.isArray( value )
                                    ? value.map( v =>
                                        ( v instanceof AppModel ? recursiveToJSON( v.toJSON() ) : v ) as unknown[]
                                    )
                                    : value

                        return [ key, newValue ]
                    }
                    )
            )
        }

        const recursiveJSONValues = recursiveToJSON( values )

        return recursiveJSONValues as T
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    async toJSONAsync(): Promise<ReturnType<typeof this.toJSON>> {
        return this.toJSON()
    }

}



/** This is only used in generators to be able to initialize the model in a tmp db to get the fields as we can't initialize the abstract table */
class AppModelNotAbstract extends AppModel<AppModelNotAbstract> {

}


export { AppModel, AppModelNotAbstract, modelsSchema }
export type { AppModelIdT }