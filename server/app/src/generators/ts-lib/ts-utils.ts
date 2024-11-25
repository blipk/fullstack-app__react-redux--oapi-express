/**
 * This file contains utility functions for working with graphs of `ts.Node`'s
 * @module
 */

/** [ BackwardRefNodeKeys[], CurrentNodeKey, ForwardRefNodeKeys[] ] **/
type NodeTuple = [string[], string, string[]];

function findSmallestSet( sets: Array<Set<string>> ): Set<string> | null {
    if ( sets.length === 0 )
        return null

    let smallestSet = sets[ 0 ]

    for ( const set of sets )
        if ( set.size < smallestSet.size )
            smallestSet = set

    return smallestSet
}

/** Turns a set of {@link NodeTuple}'s into a set of arrays that represent all contiguous chains in the graph the nodetuples represent */
function transformNodes( nodeTuples: NodeTuple[] ): Set<string[]> {
    const endNodeTuples = nodeTuples.filter( ( [ backwardRefs, _current, forwardRefs ] ) => forwardRefs.length === 0 && backwardRefs.length >= 1 )
    const startNodeTuples = nodeTuples.filter( ( [ backwardRefs, _current, forwardRefs ] ) => forwardRefs.length >= 1 && backwardRefs.length === 0 )

    // Sometimes the first type declaration node has the second node in brackets, its showing as an alias but with no directionality
    const unlinkedNodeTuples = nodeTuples
        .filter( ( [ backwardRefs, _current, forwardRefs ] ) => forwardRefs.length === 0 && backwardRefs.length === 0 )

    const unlinkedNodeTuple = unlinkedNodeTuples[ 0 ]

    if ( unlinkedNodeTuples.length > 1 )
        throw new RangeError( "Incorrect number of unlinked nodes" )

    if ( endNodeTuples.length !== 1 )
        throw new RangeError( "Incorrect number of end nodes" )

    const endNodeTuple = endNodeTuples[ 0 ]
    // const endNode = endNodeTuple[ 1 ]

    if ( startNodeTuples.length < 1 )
        throw new RangeError( "Incorrect number of start nodes" )

    // console.log( "EE", startNodeTuples.length, endNode )

    const visited = new Set<string>()
    const chains = new Set<string[]>()

    function traverse( nodeTuple: NodeTuple, chain: string[] ) {
        const [ backwardRefs, nodeKey, _forwardRefs ] = nodeTuple
        // console.log( "CC", nodeKey, chain )

        if ( visited.has( nodeKey ) ) return
        visited.add( nodeKey )
        chain.push( nodeKey )

        // Traverse backward
        backwardRefs.forEach( backRefKey => {
            const nodeTupleForBackRef = nodeTuples.find( ( [ _, nodeKey, __ ] ) => nodeKey === backRefKey )
            if ( !nodeTupleForBackRef )
                throw new Error( "Error finding nodetuple from key" )
            traverse( nodeTupleForBackRef, [ ...chain ] )
        } )

        // Add the chain once we reach a start node
        if ( !backwardRefs.length ) {
            if ( unlinkedNodeTuples.length === 1 )
                chain = [ ...chain, unlinkedNodeTuple[ 1 ] ]
            chains.add( chain )
        }
    }

    traverse( endNodeTuple, [] )

    if ( chains.size < 1 )
        throw new Error( "Error finding node graph chains" )

    if ( unlinkedNodeTuples.length === 1 && chains.size > 1 )
        throw new Error( "Node key count mismatch" )

    return chains
}


/** The first string[] is the node keys in the chain, the seconds string[] is a list of backwardRefs from the last node key in the chain  */
type ChainTuple = [string[], string[]]


/** Takes the set of chains from {@link transformNodes} and seperates them at divergant points into unique {@link ChainTuple}'s */
const transformChains = ( chains: string[][] | Set<string[]> ): ChainTuple[] => {
    if ( chains instanceof Set )
        chains = [ ...chains ]

    const chainMap = new Map<string, Set<string>>()

    // Populate the map with node and its forward references
    chains.forEach( ( chain ) => {
        for ( let i = 0; i < chain.length - 1; i++ ) {
            const current = chain[ i ]
            const next = chain[ i + 1 ]
            if ( !chainMap.has( current ) ) {
                chainMap.set( current, new Set() )
            }
            chainMap.get( current )?.add( next )
        }
    } )

    // Helper function to get forward references
    const getForwardRefs = ( node: string ): string[] => {
        return Array.from( chainMap.get( node ) || [] )
    }

    // Find unique paths and their forward references
    const seenChains = new Set<string>()
    const chainTuples: ChainTuple[] = []

    chains.forEach( ( chain ) => {
        let uniqueChain: string[] = []
        for ( let i = 0; i < chain.length; i++ ) {
            uniqueChain.push( chain[ i ] )
            const forwardRefs = getForwardRefs( chain[ i ] )

            // Create a unique key for the current chain to avoid duplicates
            const uniqueKey = uniqueChain.join( "->" ) + "|" + forwardRefs.join( "," )

            if ( i === chain.length - 1 || forwardRefs.length > 1 ) {
                if ( !seenChains.has( uniqueKey ) ) {
                    seenChains.add( uniqueKey )
                    chainTuples.push( [ uniqueChain.slice(), forwardRefs ] )
                }
                uniqueChain = [ chain[ i ] ]
            }
        }
    } )

    return chainTuples
}

export { transformNodes, transformChains, findSmallestSet }
export type { NodeTuple, ChainTuple }