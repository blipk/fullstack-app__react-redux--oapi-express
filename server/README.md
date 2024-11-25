### Server

This is a production ready strictly-typed server based on [express](https://github.com/expressjs/express), [tsoa](https://github.com/lukeautry/tsoa), [class-validator](https://github.com/typestack/class-validator) and [class-transformer](https://github.com/typestack/class-transformer).

It is a complete back-end for a small-business CMS with accounts, services and content management.

This was done as an exercise in extending my level of skill in the Python ecosystem to the TypeScript/Node ecosystem, and as an assignment for diploma studies.

For how to configure and run the server see [app/README.md](app/README.md).

There is a front-end client for this server [here](../client).


#### Features

- Fully typed with strict typescript configuration
- Completely linted with strict and consistent eslint and typescript-eslint options
- Compliant implementation of OAuth2.0 Resource Owner Password Credentials (ROPC) flow
- OpenAPI 3.0 compliant with swagger documentation/testing web UI in development mode
- Isolation of development and production functions
- Heavy use of code generation so that model and schema changes can be easily propagated
- Completely documented using [TSDoc](https://tsdoc.org/) and [TypeDoc](https://typedoc.org/)


#### Documentation

See [app/README.md](app/README.md)