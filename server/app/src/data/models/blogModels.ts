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
import { IsUrl, NotEmpty } from "@sequelize/validator.js"
/* eslint-enable @typescript-eslint/no-unused-vars */


import { AppModel, UserModel } from "./models.ts"

/**
 * BlogModel is used for a single blog post
 */
@Table( { modelName: "BlogModel" } )
class BlogModel extends AppModel<BlogModel> {

    @Attribute( DataTypes.STRING )
    @NotNull
    @NotEmpty
    declare title: string

    @Attribute( DataTypes.STRING )
    @AllowNull
    @NotEmpty
    @IsUrl
    declare imageURL?: CreationOptional<string>

    @Attribute( DataTypes.STRING )
    @NotNull
    @NotEmpty
    declare content: string

    @Attribute( DataTypes.BOOLEAN )
    @NotNull
    @Default( false )
    declare isPublished: CreationOptional<boolean>

    @Attribute( DataTypes.DATE )
    @AllowNull
    declare publishedDate?: CreationOptional<Date>

    // Associations
    @Attribute( DataTypes.INTEGER )
    declare userId: number
    /** Inverse association of {@link UserModel.blogs} */
    declare user: NonAttribute<UserModel>
    declare getUser: HasOneGetAssociationMixin<UserModel>


    @BelongsToMany( () => TagModel, {
        // through : () => BlogsTags,
        through : "BlogsTags",
        inverse : {
            as: "blogs",
        }
    } )
    declare tags?: NonAttribute<TagModel[]>
    declare getTags: BelongsToManyGetAssociationsMixin<TagModel>
    declare setTags: BelongsToManySetAssociationsMixin<TagModel, TagModel["id"]>
    declare addTag: BelongsToManyAddAssociationMixin<TagModel, TagModel["id"]>
    declare addTags: BelongsToManyAddAssociationsMixin<TagModel, TagModel["id"]>
    declare removeTag: BelongsToManyRemoveAssociationMixin<TagModel, TagModel["id"]>
    declare removeTags: BelongsToManyRemoveAssociationsMixin<TagModel, TagModel["id"]>
    declare createTag: BelongsToManyCreateAssociationMixin<TagModel>
    declare hasTag: BelongsToManyHasAssociationMixin<TagModel, TagModel["id"]>
    declare hasTags: BelongsToManyHasAssociationsMixin<TagModel, TagModel["id"]>
    declare countTags: BelongsToManyCountAssociationsMixin<TagModel>

    /** Include required associated tables in finder method default scope */
    static override establishScopes: Record<string, FindOptions<Attributes<BlogModel>>> = {
        defaultScope: {
            include: [ { association: "user" }, { association: "tags" } ],
        }
    }

}


/**
 * TagModel is used for tagging blog posts
 */
@Table( { modelName: "TagModel" } )
class TagModel extends AppModel<TagModel> {

    @Attribute( DataTypes.STRING )
    @NotNull
    @NotEmpty
    @Unique
    declare name: string

    @Attribute( DataTypes.STRING )
    @NotNull
    @NotEmpty
    @Unique
    declare cssColour: string


    /** Inverse many-to-many association {@link BlogModel.tags} */
    declare blogs?: NonAttribute<BlogModel[]>
    declare getBlogs: BelongsToManyGetAssociationsMixin<BlogModel>

}


export { BlogModel, TagModel }