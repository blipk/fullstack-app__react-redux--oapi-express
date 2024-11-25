/**
 * Utils for express servers
 * @module
 */


// const listRoutes = ( app ) => {
//     const routes = []
//     app._router.stack.forEach( ( middleware ) => {
//         if ( middleware.route ) { // routes registered directly on the app
//             routes.push( middleware.route )
//         } else if ( middleware.name === "router" ) { // router middleware
//             middleware.handle.stack.forEach( ( handler ) => {
//                 const route = handler.route
//                 route && routes.push( route )
//             } )
//         }
//     } )

//     routes.forEach( ( route ) => {
//         const methods = Object.keys( route.methods ).join( ", " ).toUpperCase()
//         console.log( `${methods} ${route.path}` )
//     } )
// }