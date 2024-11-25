/**
 * This file is the main re-exporter of all our models
 * @module
 */

// https://sequelize.org/docs/v7/other-topics/hooks/
// https://sequelize.org/docs/v7/associations/association-scopes/
// https://sequelize.org/docs/v7/associations/polymorphic-associations/

// https://sequelize.org/docs/v7/other-topics/extending-data-types/
// https://sequelize.org/docs/v7/other-topics/connection-pool/
// https://sequelize.org/docs/v7/other-topics/query-interface/
// https://sequelize.org/docs/v7/other-topics/read-replication/
// https://sequelize.org/docs/v7/other-topics/resources/

// https://sequelize.org/docs/v7/querying/transactions/

import { AppModel, AppModelNotAbstract } from "./appModel.ts"
import { UserModel, RoleModel } from "./authModels.ts"
import { BlogModel, TagModel } from "./blogModels.ts"
import { FeedbackModel } from "./feedbackModels.ts"
import { BookingModel, BookingTypeModel } from "./bookingModels.ts"

// These are what the Sequalize constructor in connector.ts use to initialize
const allModels = [
    RoleModel, UserModel,
    TagModel, BlogModel,
    FeedbackModel,
    BookingModel, BookingTypeModel
]

export {
    allModels,
    AppModel, AppModelNotAbstract,
    RoleModel, UserModel,
    TagModel, BlogModel,
    FeedbackModel,
    BookingModel, BookingTypeModel
}