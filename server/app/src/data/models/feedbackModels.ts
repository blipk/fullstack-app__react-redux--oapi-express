/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    InferAttributesOptions,
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
} from "@sequelize/core/decorators-legacy"
import { NotEmpty } from "@sequelize/validator.js"
/* eslint-enable @typescript-eslint/no-unused-vars */


import { AppModel, UserModel } from "./models.ts"

/**
 * FeedbackModel is used for feedback from a user (or an anonymous source `authorName`)
 */
@Table( { modelName: "FeedbackModel" } )
class FeedbackModel extends AppModel<FeedbackModel> {
    @Attribute( DataTypes.STRING )
    // @NotNull
    // @NotEmpty
    @AllowNull
    declare authorName: CreationOptional<string>

    @Attribute( DataTypes.STRING )
    @NotNull
    @NotEmpty
    declare title: string

    @Attribute( DataTypes.STRING )
    @NotNull
    @NotEmpty
    declare content: string

    @Attribute( DataTypes.BOOLEAN )
    @NotNull
    @Default( false )
    declare isPublic: CreationOptional<boolean>


    // Associations
    @Attribute( DataTypes.INTEGER )
    @AllowNull
    declare userId?: number
    /** Inverse association of {@link UserModel.feedbacks} */
    declare user?: NonAttribute<UserModel>
    declare getUser: HasOneGetAssociationMixin<UserModel>

    @ModelValidator
    static async validateFeedback( _feedback: FeedbackModel ): Promise<void> {
        // This ensures that the feedback author is the same as the user who left it
        // Feedbacks can be left without authentication though, so we allow inputting any authorName in that case
        const user = await _feedback.getUser()
        if ( user ) {
            _feedback.authorName = user.fullName
        }
    }


    /** Include required associated tables in finder method default scope */
    static override establishScopes: Record<string, FindOptions<Attributes<FeedbackModel>>> = {
        defaultScope: {
            include: [ { association: "user" } ],
        }
    }

}


export { FeedbackModel }