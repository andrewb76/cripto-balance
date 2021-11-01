# crypto-balance

# UI
http://0.0.0.0:3000/

# SWAGGER
http://0.0.0.0:3000/api/openapi/ui#/

# METRICS
http://0.0.0.0:3030/metrics

# test
This is a [Moleculer](https://moleculer.services/)-based microservices project. Generated with the [Moleculer CLI](https://moleculer.services/docs/0.14/moleculer-cli.html).

## Usage
Start the project with `npm run dev` command. 
After starting, open the http://localhost:3000/ URL in your browser. 
On the welcome page you can test the generated services via API Gateway and check the nodes & services.

In the terminal, try the following commands:
- `nodes` - List all connected nodes.
- `actions` - List all registered service actions.
- `call balance.tokens` - List the tokens registred for balance tracker (call the `balance.tokens` action).
- `call balance.addToken --symbol eth --token 0xhdfs76v5r5as6dfhbjbj23ru6t` - Call the `balance.addToken` action with the `symbol` and `token` parameters.


## Services
- **api**: API Gateway services
- **balance**: Service for tracking crypto curency tokens balance.
- **exchange**: Service for tracking crypto curency exchange rates.

## Mixins
- **db.mixin**: Database access mixin for services. Based on [moleculer-db](https://github.com/moleculerjs/moleculer-db#readme)


## Useful links

* Moleculer website: https://moleculer.services/
* Moleculer Documentation: https://moleculer.services/docs/0.14/

## NPM scripts

- `npm run dev`: Start development mode (load all services locally with hot-reload & REPL)
- `npm run start`: Start production mode (set `SERVICES` env variable to load certain services)
- `npm run cli`: Start a CLI and connect to production. Don't forget to set production namespace with `--ns` argument in script
- `npm run lint`: Run ESLint
- `npm run ci`: Run continuous test mode with watching
- `npm test`: Run tests & generate coverage report
- `npm run dc:up`: Start the stack with Docker Compose
- `npm run dc:down`: Stop the stack with Docker Compose

