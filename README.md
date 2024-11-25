# fullstack-app::react+redux--oapi+express

This is a monorepo for a full-stack client-server web application written in typesript.

The back-end is powered by Express/OpenAPI, more details can be found [here](./server/).

The front-end is powered by React/Redux, more details can be found [here](./client/).

This root contains docker compose configurations to launch both parts of the app behind a preconfigured nginx reverse proxy.

#### Launching

The easiest way to run the project is to rename `sample.env` to `.env` then run `docker-compose up`.

You can then navigate to https://localhost/ to view the project.

Docker Compose is included with [docker desktop](https://www.docker.com/products/docker-desktop/) on windows; or available in most linux distributions repositories.

##### Containers and Config

Running the `docker-compose up` command will build and launch all required application containers configured with the root `.env` file.

When the containers launch with the sample `.env` debug config, the server database is deleted and re-initialized with sample data and an admin user `bob@bobsgarage.com:Admin123`.

To configure the server or client further, see the [sample.env](./sample.env) files or `app/README.md` files:
[server/app/README.md](server/app/README.md)
[client/app/README.md](client/app/README.md)


###### Running without containers

Follow the documentation and instructions in both the [back-end](./server/) and [front-end](./client/) `README.md` files.

###### Development notes


- The OpenAPI-as-code ecosystem in typescript is not mature enough, and the lack of runtime types can be painful, in the future I would create servers in python, or use nestjs if constrained to typescript
- The templating scripts need a major refactor to standardise the replacements and configuration, or investigate using a third-party template engine
- The data models in the server should be in a seperate common package and the front-end scripts should have relied on them more instead of the OpenAPI schema
