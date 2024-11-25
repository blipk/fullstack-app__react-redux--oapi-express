/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    InferAttributesOptions,
    NonAttribute,

    HasOneSetAssociationMixin,
    HasOneCreateAssociationMixin,

    BelongsToGetAssociationMixin,
    BelongsToSetAssociationMixin,
    BelongsToCreateAssociationMixin,

    BelongsToManyGetAssociationsMixin,
    BelongsToManySetAssociationsMixin,
    BelongsToManyAddAssociationMixin,
    BelongsToManyAddAssociationsMixin,
    BelongsToManyRemoveAssociationMixin,
    BelongsToManyRemoveAssociationsMixin,
    BelongsToManyCreateAssociationMixin,
    BelongsToManyHasAssociationsMixin,
    BelongsToManyHasAssociationMixin,
    BelongsToManyCountAssociationsMixin,

    HasManyGetAssociationsMixin,
    HasManySetAssociationsMixin,
    HasManyAddAssociationMixin,
    HasManyAddAssociationsMixin,
    HasManyRemoveAssociationsMixin,
    HasManyCountAssociationsMixin,
    HasManyHasAssociationMixin,
    HasManyHasAssociationsMixin,
    HasManyCreateAssociationMixin,
    HasManyRemoveAssociationMixin,

    HasOneGetAssociationMixin,
    FindOptions,
    Attributes
} from "@sequelize/core"
import { DataTypes } from "@sequelize/core"

import {
    Table,
    Attribute,
    NotNull,
    Default,
    ModelValidator,
    Index,
    Unique,
    createIndexDecorator,
    HasMany,
    BelongsToMany,
    AllowNull,
    BelongsTo,
} from "@sequelize/core/decorators-legacy"
/* eslint-enable @typescript-eslint/no-unused-vars */


import { AppModel, UserModel } from "./models.ts"
import { NotEmpty } from "@sequelize/validator.js"


/**
 * BookingModel is used for a service booking by a user
 */
@Table( { modelName: "BookingModel" } )
class BookingModel extends AppModel<BookingModel> {

    @Attribute( DataTypes.DATE )
    declare bookingDate: Date

    @Attribute( DataTypes.STRING )
    // @NotEmpty
    @AllowNull
    declare bookingNotes?: string

    // Associations
    @Attribute( DataTypes.INTEGER )
    declare userId: number
    /** Inverse association of {@link UserModel.bookings} */
    declare user: NonAttribute<UserModel>
    declare getUser: HasOneGetAssociationMixin<UserModel>


    @BelongsTo( () => BookingTypeModel, {
        foreignKey : "bookingTypeId",
        targetKey  : "id",
        inverse    : {
            as   : "bookings",
            type : "hasMany",
        }
    } )
    declare bookingType: NonAttribute<BookingTypeModel[]>

    @Attribute( DataTypes.INTEGER )
    @NotNull
    declare bookingTypeId: number

    declare addBookingType: BelongsToGetAssociationMixin<BookingTypeModel>
    declare setBookingType: BelongsToSetAssociationMixin<BookingTypeModel, BookingTypeModel["id"]>
    declare createBookingType: BelongsToCreateAssociationMixin<BookingTypeModel>


    /** Include required associated tables in finder method default scope */
    static override establishScopes: Record<string, FindOptions<Attributes<BookingModel>>> = {
        defaultScope: {
            include: [ { association: "user" }, { association: "bookingType" } ],
        }
    }

}


/**
 * BookingTypeModel is used for the type of booking a BookingModel is
 */
@Table( { modelName: "BookingTypeModel" } )
class BookingTypeModel extends AppModel<BookingTypeModel> {

    @Attribute( DataTypes.STRING )
    @NotNull
    @NotEmpty
    @Unique
    declare name: string

    @Attribute( DataTypes.STRING )
    @NotNull
    @NotEmpty
    declare description: string

    // TODO: Sqlite doesnt support DECIMAL - should we use a BigInt and a decimal library?
    @Attribute( DataTypes.DOUBLE )
    @NotNull
    declare price: number


    /** Inverse many-to-many association {@link BookingModel.bookingTypes} */
    declare bookings?: NonAttribute<BookingModel[]>
    declare getBookings: BelongsToManyGetAssociationsMixin<BookingModel>

}

export { BookingModel, BookingTypeModel }
