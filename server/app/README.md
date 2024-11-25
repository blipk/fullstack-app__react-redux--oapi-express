### Server App Package

####  Running the server

1. Configure the server application via a `.env` file (example at [sample.env](sample.env))

2. Generate and seed a database with `pnpm run gen-database <optional_admin_password>` (the default password is `Admin123`)

3. Run the server:
    `pnpm run serve` to run without watching for changes
    `pnpm run dev` to run watching changes
    `pnpm run devgen` to run watching changes and also rebuild generated files on changes (required when changing controllers or models)

#### Documentation

Server application API documentation can be viewed at [../docs/generated/index.html](../docs/generated/index.html)

Server REST OpenAPI documentation can be viewed by configuring the server to run in development mode and then navigating to http://localhost:3000/docs

See the [Config](./src/config/config.ts#L66-L88) interface for all available server configuration options (also documented in the application API documentation)


#### Scripts in `package.json`

The following `package.json` scripts must be run before first starting the application:

1. `gen-database` - This creates the database and tables then seeds them with data


The following scripts are run (in this order) via `pnpm run gen-all` or are run automatically in watch mode via `pnpm run devgen`:

1. `gen-class-validators`:
    This generates generates `class-validator` models from the sequelize models
    These are used as DTOs in `tsoa` controllers and their routes.
    This is run whenever running `gen-tsoa`.

2. `gen-controllers`: Generates `tsoa` `Controller`'s classes for all `sequelize` models from a template controller file

3. `gen-tsoa`: This programatically generates the `tsoa` routes and OpenAPI spec using typescript.

4. `gen-api-client`: Generates an axios client for the frontend from the OpenAPI spec file that `gen-tsoa` makes


The following scripts are used as required:

1. `gen-docs`: Generates documentation for the server application with `TypeDoc`


The following scripts are unused:

1. `tsoa-gen-cli`: This does the same as `gen-tsoa` but via the CLI and `tsoa.json` - prefer using the typescript module.
2. `gen-api-schema`: This generates OpenAPI schemas from the sequelize class models, it was going to be used by `@wesleytodd/openapi` or `express-openapi-validator` but I decided to go with `tsoa` for a code-first solution and for better typescript support, superceded by `gen-class-validators`