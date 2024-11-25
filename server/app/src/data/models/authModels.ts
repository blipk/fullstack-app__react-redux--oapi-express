/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
    InferAttributes,
    CreationOptional,
    NonAttribute,
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
    HasManyAddAssociationsMixin,
    HasManyRemoveAssociationsMixin,
    HasManyCountAssociationsMixin,
    HasManyHasAssociationsMixin,
    HasManyCreateAssociationMixin,
    HasManyAddAssociationMixin,
    FindOptions,
    Attributes
} from "@sequelize/core"
import { DataTypes, sql } from "@sequelize/core"

import {
    Table,
    Attribute,
    AllowNull,
    NotNull,
    Default,
    ModelValidator,
    Index,
    Unique,
    createIndexDecorator,
    HasMany,
    BelongsToMany,
    AfterCreate,
    ValidateAttribute
} from "@sequelize/core/decorators-legacy"
import { IsEmail, NotEmpty, IsUrl } from "@sequelize/validator.js"
/* eslint-enable */

import { AppModel, BlogModel, FeedbackModel, BookingModel } from "./models.ts"


const NameIndex = createIndexDecorator( "NameIndex", {
    name         : "firstName-lastName",
    type         : "fulltext",
    concurrently : true,
} )


/** Interface for the extra virtual/computed attribute son {@link UserModel} */
interface UserModelAttributes extends InferAttributes<UserModel> {
    isAdmin?: boolean;
    isStaff?: boolean;
    fullName: string;
}

/**
 * UserModel represents an authenticated user of the application
 */
// Explicitly set the modelName to prevent issues if a minifier changes the class name
@Table( { modelName: "UserModel" } )
class UserModel extends AppModel<UserModel, UserModelAttributes> {

    @Attribute( DataTypes.STRING )
    @NotNull
    @NotEmpty
    @NameIndex
    declare firstName: string

    @Attribute( DataTypes.STRING )
    @NotNull
    @NotEmpty
    @NameIndex
    declare lastName: string

    @Attribute( DataTypes.STRING )
    @NotNull
    @NotEmpty
    @IsEmail
    //@Unique // This is the same as using the unique option on @Index below
    @Index( { unique: true } )
    declare email: string


    @Attribute( DataTypes.STRING )
    @NotNull
    @NotEmpty
    @ValidateAttribute( { len: [ 8, 100 ] } )
    declare password: string

    @Attribute( DataTypes.STRING )
    // @NotEmpty
    @AllowNull
    @IsUrl
    declare profileImageURL?: CreationOptional<string>

    @Attribute( DataTypes.STRING )
    @AllowNull
    // @NotEmpty
    // @ValidateAttribute( { len: [ 8, 1024 ] } )
    declare profileText?: CreationOptional<string>


    // Virtual attribute, not stored in database
    // The attribute decorator makes it available using User.get("fullName")
    @Attribute( DataTypes.VIRTUAL( DataTypes.STRING, [ "firstName", "lastName" ] ) )
    get fullName(): NonAttribute<string> {
        return `${this.firstName} ${this.lastName}`
    }

    @Attribute( DataTypes.VIRTUAL( DataTypes.BOOLEAN, [ ] ) )
    get isAdmin(): NonAttribute<Promise<boolean>> {
        // No `async` keyword for getters so use an IIFE to return a Promise
        return ( async () => {
            const thisRoles = await this.getRoles()
            const adminRole = thisRoles.find( ( role: RoleModel ) => role.name === "admin" )
            return Boolean( adminRole )
        } )()
    }

    @Attribute( DataTypes.VIRTUAL( DataTypes.BOOLEAN, [ ] ) )
    get isStaff(): NonAttribute<Promise<boolean>> {
        // No `async` keyword for getters so use an IIFE to return a Promise
        return ( async () => {
            const thisRoles = await this.getRoles()
            const adminRole = thisRoles.find( ( role: RoleModel ) => role.name === "staff" )
            return Boolean( adminRole )
        } )()
    }


    // Validator for whole model, throwing an error is considered a validation failure
    // declare as static to recieve an instance of the model as the arg
    @ModelValidator
    static validateUser( _user: UserModel ): void {
        // We don't need to do this as we're using the provided @IsEmail validator
        // if ( ( !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test( this.email ) ) ) {
        //     throw new Error( "Email is invalid!" )
        // }
    }


    // Hooks
    @AfterCreate( { name: "UserModel.afterCreate" } )
    static async addDefaultRoles( user: UserModel ): Promise<void> {
        const userRole = await RoleModel.findOne( { where: { name: "user" } } )
        if ( !userRole ) {
            console.error( "Could not find default `user` role" )
            return
        }
        await user.addRole( userRole )
        console.log( `Added default \`user\` role to user: ${user.get( "email" )}` )
    }


    // Extra functions
    override async toJSONAsync(): Promise<UserModelAttributes> {
        const values = await super.toJSONAsync()

        // @ts-expect-error: Always exclude user password hashes when using `toJSON` as that method does not always obey scopes
        delete values.password

        // Add the computed properties
        values.isAdmin = await this.isAdmin
        values.isStaff = await this.isStaff
        values.fullName = this.fullName

        return values
    }

    // Still going to exclude password hashes in a scope
    static override establishScopes: Record<string, FindOptions<Attributes<UserModel>>> = {
        defaultScope: {
            attributes: {
                exclude : [ "password" ],
                // Add virtual attribute to dynamically computed dataValues, otherwise its only resolve with toJSON()
                include : [ [ sql`firstName || lastName`, "fullName" ] ]
                // TODO: Can we add isAdmin and isStaff without a full SQL query
            }
        },
        withPassword: {
            attributes: {
                include: [ "password" ],
            }
        }
    }

    // Associations

    // A User have multiple Roles, and a Role may have multiple users,
    // thus we use a Many-to-Many relationships, which creates a junction table/model `UsersRoles`,
    // which sequelize calls a 'through table'
    // this junction table will be automatically created and managed by sequelize
    // we could also declare the through table model `through: () => UsersRoles` if we required further customisation
    @BelongsToMany( () => RoleModel, {
        // through : () => UsersRoles,
        through : "UsersRoles",
        inverse : {
            as: "users",
        }
    } )
    declare roles?: NonAttribute<RoleModel[]> // we cant actually read the roles from this field, we have to use one of the functions below

    // These are getters and setters for the above association
    declare getRoles: BelongsToManyGetAssociationsMixin<RoleModel>
    declare setRoles: BelongsToManySetAssociationsMixin<RoleModel, RoleModel["id"]>
    declare addRole: BelongsToManyAddAssociationMixin<RoleModel, RoleModel["id"]>
    declare addRoles: BelongsToManyAddAssociationsMixin<RoleModel, RoleModel["id"]>
    declare removeRole: BelongsToManyRemoveAssociationMixin<RoleModel, RoleModel["id"]>
    declare removeRoles: BelongsToManyRemoveAssociationsMixin<RoleModel, RoleModel["id"]>

    // This will create and add a role
    declare createRole: BelongsToManyCreateAssociationMixin<RoleModel>

    // These will check the roles
    declare hasRole: BelongsToManyHasAssociationMixin<RoleModel, RoleModel["id"]>
    declare hasRoles: BelongsToManyHasAssociationsMixin<RoleModel, RoleModel["id"]>
    declare countRoles: BelongsToManyCountAssociationsMixin<RoleModel>


    @HasMany( () => BlogModel, {
        foreignKey : "userId",
        inverse    : {
            as: "user",
        }
    } )
    /** Inverse association of {@link BlogModel.user} */
    declare blogs?: NonAttribute<BlogModel[]>
    declare getBlogs: HasManyGetAssociationsMixin<BlogModel>
    declare setBlogs: HasManySetAssociationsMixin<BlogModel, BlogModel["id"]>
    declare addBlog: HasManyAddAssociationMixin<BlogModel, BlogModel["id"]>
    declare addBlogs: HasManyAddAssociationsMixin<BlogModel, BlogModel["id"]>
    declare removeBlogs: HasManyRemoveAssociationsMixin<BlogModel, BlogModel["id"]>
    declare createBlog: HasManyCreateAssociationMixin<BlogModel, "id">
    declare hasBlogs: HasManyHasAssociationsMixin<BlogModel, BlogModel["id"]>
    declare countBlogs: HasManyCountAssociationsMixin<BlogModel>


    @HasMany( () => FeedbackModel, {
        foreignKey : "userId",
        inverse    : {
            as: "user",
        }
    } )
    /** Inverse association of {@link FeedbackModel.user} */
    declare feedbacks?: NonAttribute<FeedbackModel[]>
    declare getFeedbacks: HasManyGetAssociationsMixin<FeedbackModel>
    declare setFeedbacks: HasManySetAssociationsMixin<FeedbackModel, FeedbackModel["id"]>
    declare addFeedback: HasManyAddAssociationMixin<FeedbackModel, FeedbackModel["id"]>
    declare addFeedbacks: HasManyAddAssociationsMixin<FeedbackModel, FeedbackModel["id"]>
    declare removeFeedbacks: HasManyRemoveAssociationsMixin<FeedbackModel, FeedbackModel["id"]>
    declare createFeedback: HasManyCreateAssociationMixin<FeedbackModel, "id">
    declare hasFeedbacks: HasManyHasAssociationsMixin<FeedbackModel, FeedbackModel["id"]>
    declare countFeedbacks: HasManyCountAssociationsMixin<FeedbackModel>


    @HasMany( () => BookingModel, {
        foreignKey : "userId",
        inverse    : {
            as: "user",
        }
    } )
    /** Inverse association of {@link BookingModel.user} */
    declare bookings?: NonAttribute<BookingModel[]>
    declare getBookings: HasManyGetAssociationsMixin<BookingModel>
    declare setBookings: HasManySetAssociationsMixin<BookingModel, BookingModel["id"]>
    declare addBooking: HasManyAddAssociationMixin<BookingModel, BookingModel["id"]>
    declare addBookings: HasManyAddAssociationsMixin<BookingModel, BookingModel["id"]>
    declare removeBookings: HasManyRemoveAssociationsMixin<BookingModel, BookingModel["id"]>
    declare createBooking: HasManyCreateAssociationMixin<BookingModel, "id">
    declare hasBookings: HasManyHasAssociationsMixin<BookingModel, BookingModel["id"]>
    declare countBookings: HasManyCountAssociationsMixin<BookingModel>

}

// class UsersRoles extends AppModel<UsersRoles> {
//     declare userId: number
//     declare roleId: number
// }

/**
 * RoleModel's are used to distinguish the permissions of Users
 * They are set up in `initializer.ts`, the main roles being `staff`, `admin` and `user`
 * If a user has no roles they are a standard user but they always should due to the AfterCreate hook on UserModel
 *
 * See {@link auth/authMiddleware} for more details
 */
@Table( { modelName: "RoleModel" } )
class RoleModel extends AppModel<RoleModel> {

    @Attribute( DataTypes.STRING )
    @NotNull
    @NotEmpty
    @Unique
    declare name: string

    // This is the inverse association field for the Many-to-Many relationships defined on `User`
    /** Declared by {@link UserModel.roles} */
    declare users?: NonAttribute<UserModel[]>

}

export { UserModel, RoleModel }