/**
 * This file contains functions for initilizing an seeding the application database
 *
 * This should NEVER be run in production
 *
 * @module
 */
import fs from "fs"
import path from "path"

import type { CreationAttributes, Model } from "@sequelize/core"

import defaultDb, { connectDB, recreateDB, shutdownDB } from "./connector.ts"
import { ensureDevMode } from "../config/config.ts"

import {
    type UserModel,
    RoleModel,
    TagModel, BlogModel,
    FeedbackModel,
    BookingModel,
    BookingTypeModel
} from "./models/models.ts"

import { AuthService } from "../auth/authService.ts"


/**
 * This function logs the name of and the count of models created,
 * and if `expected` is passed it asserts that is how many where created.
 *
 * @param createdModels - the models that were created
 * @param expected - the amount of models that were expected to be created
 */
const logCreation = ( createdModels: Model[], expected?: number ) => {
    const modelCount = createdModels.length
    const modelName = createdModels[ 0 ]?.modelDefinition.modelName
    if ( expected && expected !== modelCount )
        throw new Error(
            `Expected to create ${expected} ${modelName})'s but created  ${modelCount}`
        )
    console.log( `Created ${modelCount} ${modelName}'s` )
}

/**
 * This function deletes and recreates the application database and then seeds it with data
 * @param shutdownDb - The password to use for the admin account
 * @param shutdownDb - Whether to shutdown the db connection after
 */
const dbInitializer = async ( adminUserPassword?: string, shutdownDb = true ): Promise<void> => {
    ensureDevMode()

    await defaultDb.transaction( async () => {
        /** Setup */
        console.warn( "Deleting and re-initiliazing database" )

        await connectDB( { sync: false } )

        await recreateDB()

        const authService = new AuthService()


        /** Roles */
        const roles = [ "admin", "staff", "user" ]
        const createdRoles = await authService.createRoles( roles )
        logCreation( createdRoles, roles.length )

        // Both these methods work
        const adminRole = createdRoles.find( ( role: RoleModel ) => role.name === "admin" )
        const staffRole = await RoleModel.findOne( { where: { name: "staff" } } )

        if ( !adminRole || !staffRole ) {
            console.error( "Could not find newly created role" )
            process.exit()
        }


        /** Users */
        const defaultAdminPassword = "Admin123"
        adminUserPassword = adminUserPassword || defaultAdminPassword
        const bobTheAdmin: CreationAttributes<UserModel> = {
            firstName       : "Bob",
            lastName        : "Bobbington",
            email           : "bob@bobsgarage.com",
            password        : adminUserPassword,
            profileText     : "Bob is the owner of Bobs Garage and has been a fine member of the community for decades",
            profileImageURL : "https://upload.wikimedia.org/wikipedia/en/c/c5/Bob_the_builder.jpg",
        }

        const bobTheAdminUser = await authService.createUser( bobTheAdmin )
        logCreation( [ bobTheAdminUser ], 1 )
        // The userRole is added in the Model configuration to all users
        await bobTheAdminUser.addRoles( [ adminRole, staffRole ] )

        // Tests
        // const bobsRoles = await bobTheAdminUser.getRoles()
        // console.log ( "bob roles:", bobsRoles )
        // console.log ( "bobs fullname:", bobTheAdminUser.fullName )
        // console.log ( "bobs fullname:", bobTheAdminUser.get( "fullName" ) )
        // console.log ( "bob isAdmin?:", await bobTheAdminUser.isAdmin )
        // console.log ( "bob isAdmin?:", await bobTheAdminUser.get( "isAdmin" ) )

        const janusTheStaff: CreationAttributes<UserModel> = {
            firstName       : "Janus",
            lastName        : "Bobbington",
            email           : "j@bobsgarage.com",
            password        : "Janus123",
            profileText     : "Janus is Bob's wife and does exceptional HR work",
            profileImageURL : "https://masterpiecer-images.s3.yandex.net/e74b1d358e2b11ee90f7da477c0f1ee2:upscaled"
        }
        const janusTheStaffUser = await authService.createUser( janusTheStaff )
        await janusTheStaffUser.addRole( staffRole )
        logCreation( [ janusTheStaffUser ], 1 )

        const mechanicsStaffUsers: Array<CreationAttributes<UserModel>> = [
            {
                firstName   : "James",
                lastName    : "Jones",
                email       : "jj@hh7.com",
                password    : "JJ445577",
                profileText : "Can change oil faster than nascar",
                profileImageURL:
                "https://i.pinimg.com/736x/d5/bb/f7/d5bbf7b71804ad03589b12f571f82087.jpg"
            },
            {
                firstName       : "Les",
                lastName        : "Lee",
                email           : "workemail@hmail7.com",
                password        : "LL123456",
                profileText     : "Been a mechanic since the steam ships",
                profileImageURL : "https://upload.wikimedia.org/wikipedia/commons/a/a8/Les_Lee_H05990.jpg",
            }
        ]
        const createdMechanicsStaffUsers = await Promise.all(
            mechanicsStaffUsers.map(
                async mechanicStaffUsers => {
                    const createdUser = await authService.createUser( mechanicStaffUsers )
                    await createdUser.addRole( staffRole )
                    return createdUser
                }
            )
        )

        logCreation( createdMechanicsStaffUsers, 2 )

        const customerUsers: Array<CreationAttributes<UserModel>> = [
            {
                firstName : "Rex",
                lastName  : "Hunt",
                email     : "rex@0utl99k.com",
                password  : "Rex12345",
            }
        ]
        const createdCustomerUsers = await Promise.all(
            customerUsers.map(
                async customerUser => await authService.createUser( customerUser )
            )
        )
        logCreation( createdCustomerUsers, customerUsers.length )

        const rexTheCustomerUser = createdCustomerUsers.find( customerUser => customerUser.email === "rex@0utl99k.com" )
        if ( !rexTheCustomerUser ) {
            console.error( "Could not find newly created customer uer" )
            process.exit()
        }


        /** Feedback */
        const bobsFeedback: CreationAttributes<FeedbackModel> = {
            title    : "Bobs Feedback",
            content  : "The best shop in town, just talk to me if you think otherwise!",
            isPublic : true,
            userId   : bobTheAdminUser.id
        }
        // Two ways to do the same thing
        // const createdFeedback: FeedbackModel = await bobTheAdminUser.createFeedback( bobsFeedback )
        const createdFeedback = await FeedbackModel.create( bobsFeedback )
        logCreation( [ createdFeedback ], 1 )


        const communityFeedback: Array<CreationAttributes<FeedbackModel>> = [
            {
                title   : "Lorem Ipsum",
                content : `Integer ultricies, nisl vitae sagittis dapibus, nisi ex gravida nibh, vel pretium ligula
nisi gravida purus. Donec lacinia nibh luctus, pulvinar nunc eget, cursus diam.
Nam et dolor eget eros volutpat lobortis. Sed pellentesque faucibus enim, ac
varius dui tempor vitae.`,
                authorName : "Lorem",
                isPublic   : true
            },
            {
                title      : "Best shop around",
                content    : "Fixed real problems and didn't rip me off, Bob is great to chat with too.",
                authorName : "Rory",
                isPublic   : true,
                userId     : rexTheCustomerUser.id
            },
            {
                title    : "Great place",
                content  : "They know their stuff",
                isPublic : true,
                userId   : janusTheStaffUser.id
            },
            {
                title   : "Lorem Ipsum",
                content : `Integer ultricies, nisl vitae sagittis dapibus, nisi ex gravida nibh, vel pretium ligula
nisi gravida purus. Donec lacinia nibh luctus, pulvinar nunc eget, cursus diam.
Nam et dolor eget eros volutpat lobortis. Sed pellentesque faucibus enim, ac
varius dui tempor vitae.`,
                authorName : "Lorem",
                isPublic   : true
            },
            {
                title    : "Shithouse",
                content  : "Bunch of crooks",
                isPublic : false
            }
        ]
        const createdCommunityFeedback = await FeedbackModel.bulkCreate( communityFeedback )
        logCreation( createdCommunityFeedback, communityFeedback.length )


        /** Tags */
        const randomCssColour = () => `#${Math.floor( Math.random() * 16777215 ).toString( 16 ).padStart( 6, "0" )}`

        const tagNames = [ "News", "Media", "Workshop", "Community" ]
        const initialTags: Array<CreationAttributes<TagModel>> = tagNames.map(
            tagName => ( { name: tagName, cssColour: randomCssColour() } )
        )
        const createdTags = await TagModel.bulkCreate( initialTags )
        logCreation( createdTags, initialTags.length )


        /** Blogs */
        const blogContent = fs.readFileSync( path.join( import.meta.dirname, "seeds/lorem-ipsum.txt" ) ).toString()
        const exampleBlogs: BlogModel[] = await BlogModel.bulkCreate( [
            {
                title       : "Test Unpublished Post",
                content     : blogContent,
                userId      : bobTheAdminUser.id,
                isPublished : false,
            },
            {
                title         : "Our Shop",
                content       : blogContent,
                userId        : bobTheAdminUser.id,
                isPublished   : true,
                publishedDate : new Date( new Date().setDate( new Date().getDate() - 60 ) )
            },
            {
                title         : "Special Days",
                content       : blogContent,
                imageURL      : "https://treesforall.nl/app/uploads/2022/04/275A1122-768x512.jpg",
                userId        : bobTheAdminUser.id,
                isPublished   : true,
                publishedDate : new Date( new Date().setDate( new Date().getDate() - 30 ) )
            },
            {
                title         : "Staff Announcement",
                content       : blogContent,
                imageURL      : "https://treesforall.nl/app/uploads/2022/04/275A1122-768x512.jpg",
                userId        : janusTheStaffUser.id,
                isPublished   : true,
                publishedDate : new Date( new Date().setDate( new Date().getDate() - 25 ) )
            },
            {
                title         : "Special Days",
                content       : blogContent,
                imageURL      : "https://treesforall.nl/app/uploads/2022/04/275A1122-768x512.jpg",
                userId        : janusTheStaffUser.id,
                isPublished   : true,
                publishedDate : new Date( new Date().setDate( new Date().getDate() - 20 ) )
            },
            {
                title         : "Staff Holiday",
                content       : blogContent,
                imageURL      : "https://treesforall.nl/app/uploads/2022/04/275A1122-768x512.jpg",
                userId        : janusTheStaffUser.id,
                isPublished   : true,
                publishedDate : new Date( new Date().setDate( new Date().getDate() - 7 ) )
            },
            {
                title         : "Christmas Break",
                content       : blogContent,
                imageURL      : "https://treesforall.nl/app/uploads/2022/04/275A1122-768x512.jpg",
                userId        : janusTheStaffUser.id,
                isPublished   : true,
                publishedDate : new Date( new Date().setDate( new Date().getDate() - 3 ) )
            }
        ] )
        logCreation( exampleBlogs, 7 )

        const getRandomElements = <T>( arr: T[] ): T[] => {
            const result = []
            const usedIndices = new Set()

            while ( result.length < Math.ceil( Math.random() * arr.length ) ) {
                const randomIndex = Math.floor( Math.random() * arr.length )
                if ( !usedIndices.has( randomIndex ) ) {
                    result.push( arr[ randomIndex ] )
                    usedIndices.add( randomIndex )
                }
            }

            return result
        }
        for ( const exampleBlog of exampleBlogs ) {
            await exampleBlog.addTags( getRandomElements( createdTags ) )
        }

        /** BookingTypes */
        const bookingTypesDetails: Array<CreationAttributes<BookingTypeModel>> = [
            {
                name        : "Basic Service",
                price       : 129,
                description : `✔️ Up to 8 litres of premium engine oil

✔️ Premium oil filter

✔️ Detailed vehicle inspection
`
            },
            {
                name        : "Premium Service",
                price       : 189,
                description : `✔️ Up to 8 litres of premium engine oil

✔️ Premium oil filter

✔️ Detailed vehicle inspection

✔️ 12 months free roadside assistance.

✔️ Engine management diagnosis scan

✔️ Wheel rotation as required`
            },
        ]
        const bookingTypes = await BookingTypeModel.bulkCreate( bookingTypesDetails )
        const premiumBookingType = bookingTypes.find( ( bookingType: RoleModel ) => bookingType.name.includes( "Premium" ) )
        if ( !premiumBookingType )
            throw new Error( "Couldn't find created booking type" )

        logCreation( bookingTypes, 2 )


        /** Bookings */
        const weeksToMilliseconds = ( weeks: number ) => weeks * 24 * 60 * 60 * 1000
        const hoursToMilliseconds = ( hours: number ) => hours * 60 * 60 * 1000
        const oneWeekTwoHoursFromNow = new Date().getTime() + weeksToMilliseconds( 1 ) + hoursToMilliseconds( 2 )
        const bobsBookingDetails: CreationAttributes<BookingModel> = {
            bookingDate   : new Date( oneWeekTwoHoursFromNow ),
            bookingNotes  : "Wheel adjustment",
            userId        : bobTheAdminUser.id,
            bookingTypeId : premiumBookingType.id
        }

        const bobsBooking = await BookingModel.create( bobsBookingDetails )
        logCreation( [ bobsBooking ], 1 )

        const customerBookingsDetails: Array<CreationAttributes<BookingModel>> = [
            {
                bookingDate   : new Date( oneWeekTwoHoursFromNow ),
                bookingNotes  : "Engine rebuild",
                userId        : rexTheCustomerUser.id,
                bookingTypeId : premiumBookingType.id
            }
        ]
        const customerBookings = await BookingModel.bulkCreate( customerBookingsDetails )
        logCreation( customerBookings, customerBookingsDetails.length )

        return true
    } )
        .then( async _result => {
            if ( shutdownDb ) await shutdownDB()
            console.log( "Database initialization and seeding complete" )
        } )
        .catch( ( e: unknown ) => {
            console.error( "Database initialization failed - transaction rolled back" )
            throw e
        } )

}


const isRunDirectly = import.meta.filename.includes( process.argv[ 1 ] )
if ( isRunDirectly )
    await dbInitializer( process.argv[ 2 ] )

export { dbInitializer }