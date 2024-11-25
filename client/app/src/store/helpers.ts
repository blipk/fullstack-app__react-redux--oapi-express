/**
 * This file contains helper functions for working with the Redux stores/reducers/state
 *
 * @module
 */


/**
 * Saves some state to localstorage
 *
 * @param storageKey - the localStorage item key to save to
 * @param state - the state to save to the local storage item
 */
const saveState = ( storageKey: string, state: object ): void => {
    try {
        const serializedState = JSON.stringify( state )
        localStorage.setItem( storageKey, serializedState )
        console.log( `${storageKey} saved to localStorage` )
    } catch ( err: unknown ) {
        console.error( "Error saving state:", err )
    }
}

/**
 * Loads some state from local storage
 *
 * @param storageKey - the localStorage item to load the state from
 */
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
const loadState = <StateType = object>( storageKey: string ): StateType | undefined => {
    try {
        const serializedState = localStorage.getItem( storageKey )
        if ( serializedState === null )
            return undefined

        const result: StateType = JSON.parse( serializedState ) as StateType
        console.log( `${storageKey} loaded from localStorage` )
        return result
    } catch ( err: unknown ) {
        console.error( "Error loading state:", err )
        return undefined
    }
}



export { saveState, loadState }