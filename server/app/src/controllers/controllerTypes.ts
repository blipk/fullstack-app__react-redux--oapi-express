/**
 * This file contains some types and values common to all controllers
 * @module
 */


/** Possible values for the filter query paramater on controller routes */
enum OrderByFieldValues {
    CREATED_AT_ASC = "createdAt",
    UPDATED_AT_ASC = "updatedAt",
    CREATED_AT_DESC = "-createdAt",
    UPDATED_AT_DESC = "-updatedAt"
}

/** Default value for the filter query paramater on controller routes */
const defaultOrdering = OrderByFieldValues.CREATED_AT_ASC

/** Values of {@link OrderByFieldValues} */
const orderByFieldValuesNames = Object.values( OrderByFieldValues ).filter( ( v ) => isNaN( Number( v ) ) )


export { OrderByFieldValues, defaultOrdering, orderByFieldValuesNames }