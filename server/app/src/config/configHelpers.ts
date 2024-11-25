/**
 * This file contains utilities for parsing and validating application configuration - used by {@link config/config}
 * @module
 */


// Validation functions for config options
const failConfigValidation = ( message: string, warn = false ): void => {
    const reporter = warn ? console.warn : console.error
    reporter( message )
    if ( !warn )
        process.exit( 1 )
}
const validateConfigField = (
    fieldValue: unknown,
    validator: ( fieldValue: unknown ) => boolean,
    failureMessage: string,
    warn = false
): void => {
    if ( !validator( fieldValue ) )
        failConfigValidation( failureMessage, warn )
}

const rangeValidator = ( value: number, min: number, max: number ): boolean => ( value >= min && value <= max )
const numberValidator = ( value: unknown, checkIsFinite = true ): boolean =>
    !Number.isNaN( value ) && ( !checkIsFinite || Number.isFinite( value ) )

const numberRangeValidator = ( value: unknown, min: number, max: number ): boolean =>
    numberValidator( value, false )
    && rangeValidator( value as number, min, max )

const integerValidator = ( value: unknown, checkIsFinite = true ): boolean =>
    numberValidator( value, checkIsFinite ) && ( !checkIsFinite || Number.isInteger( value ) )

const integerRangeValidator = ( value: unknown, min: number, max: number ): boolean =>
    integerValidator( value, false )
    && rangeValidator( value as number, min, max )


export {
    failConfigValidation, validateConfigField,

    rangeValidator,
    numberValidator, numberRangeValidator,
    integerValidator, integerRangeValidator
}