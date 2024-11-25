/**
  * This is a wrapper for the server {@link index} that generates the routes and OAPI spec using {@link generators/tsoa-generator}
  *
  * Use the `devgen` script in `package.json` to run this
  * @module
 */

// Regenerate all TSOA routes and pre-requisites

import { generateAll } from "./generators/generate-all.ts"
await generateAll( { includeClient: false } )

await import( "./index.ts" )