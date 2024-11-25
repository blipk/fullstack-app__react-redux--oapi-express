/**
 * This file contains typing and classes that generate the APIs successful data responses
 *
 *  @remarks
 *  Successful Data responses have a data key that is an object or an array of objects;
 *  Error responses have an error key that (should be) an array of strings.
 *
 * @module
 */


/**
 * Represents metadata for the data returned
 *
 * @param dataType - the name of the type of the data returned
 */
interface MetaData<DataTypeName extends string> {
    dataType: DataTypeName
    [key: string]: object | string | number | boolean | null | undefined;
}


/** Represents the response body of a data response */
interface DataResponseBody<
    DataType, //  extends object
    DataTypeName extends string,
    DataResponseMessageT extends string
> {
    data: DataType,
    message: DataResponseMessageT
    metadata?: MetaData<DataTypeName>
}

/**
 * This class is used for constructing the response body of the applications data responses
 */
class DataResponder {

    static Response<
        DataType extends object,
        DataTypeName extends string,
        DataResponseMessageT extends string,
    >(
        data: DataType,
        message: DataResponseMessageT,
        metadata?: MetaData<DataTypeName>
    ): DataResponseBody<DataType, DataTypeName, DataResponseMessageT> {
        return {
            data     : data,
            message  : message,
            metadata : metadata,
        }
    }

}


export type {
    DataResponseBody,
    MetaData,
}

export { DataResponder }