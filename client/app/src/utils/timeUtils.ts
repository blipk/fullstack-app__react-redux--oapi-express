/**
 * This file contains utilities for working with Date objects, datetime ISO strings and date and datetime-local type inputs
 *
 * @module
 */

/**
 * Converts and ISO datetime string to a value for HTML input elements with the "date" or "datetime-local" type
 *
 * @param dateOrISOString - The iso datetime string to convert
 * @param datetimeLocal - Whether to include the time component, for a input element with the "datetime-local" type
 * @returns
 */
const convertISOToDateInputValue = ( dateOrISOString: Date | string | undefined, datetimeLocal: boolean ): string => {
    if ( !dateOrISOString )
        return ""

    const date = new Date( dateOrISOString )

    const year = date.getFullYear()
    const month = ( date.getMonth() + 1 ).toString().padStart( 2, "0" ) // Months are zero-based
    const day = date.getDate().toString().padStart( 2, "0" )
    const hours = date.getHours().toString().padStart( 2, "0" )
    const minutes = date.getMinutes().toString().padStart( 2, "0" )

    // Return the formatted date string as YYYY-MM-DD
    return datetimeLocal ? `${year}-${month}-${day}T${hours}:${minutes}` : `${year}-${month}-${day}`
}

/**
 * Generates a series of values to use for option elements in a select element that designate time slot intervals
 *
 * @param startHour - The hour to start at for the first option
 * @param endHour - The hour to end at for the last option
 * @param intervalMinutes - The interval between or length of each time slots
 *
 * @returns The list of option values as strings
 */
const generateTimeOptions = ( startHour: number, endHour: number, intervalMinutes = 30 ): string[] => {
    const options: string[] = []
    for ( let hour = startHour; hour <= endHour; hour++ ) {
        for ( let minute = 0; minute < 60; minute += intervalMinutes ) {
            const timeOption = `${hour.toString().padStart( 2, "0" )}:${minute.toString().padStart( 2, "0" )}`
            options.push( timeOption )
        }
    }
    return options
}

/**
 * Converts an ISO date string into a value matching one of {@link generateTimeOptions} returned values
 *
 * @param dateOrISOString - The ISO date string to convert to an option element value
 * @param startHour - Output an empty value if the time component is before this
 * @param endHour - Output an empty value if the time component is after this
 * @returns
 */
const convertISOToTimeOption = ( dateOrISOString: Date | string, startHour?: number, endHour?: number ): string => {
    const date = new Date( dateOrISOString )
    const hours = date.getUTCHours()
    const minutes = date.getUTCMinutes()

    // Round down to the nearest 30 minutes
    const roundedMinutes = minutes < 30 ? 0 : 30

    const localHours = hours - date.getTimezoneOffset() / 60 // Convert UTC to local time
    // const localMinutes = ( minutes + date.getTimezoneOffset() ) % 60

    if ( startHour && localHours < startHour
        || endHour && localHours > endHour ) {
        return "" // Out of range
    }

    return `${localHours.toString().padStart( 2, "0" )}:${roundedMinutes.toString().padStart( 2, "0" )}`
}

const weeksToMilliseconds = ( weeks: number ): number => weeks * 24 * 60 * 60 * 1000
const hoursToMilliseconds = ( hours: number ): number => hours * 60 * 60 * 1000

export {
    convertISOToDateInputValue,

    generateTimeOptions,
    convertISOToTimeOption,

    weeksToMilliseconds,
    hoursToMilliseconds,
}