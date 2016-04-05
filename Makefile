NODE_VERSION=4.4.0
.PHONY: help install npm clean test coverage lint docker-build docker-run-debug docker-run-prod docker-stop-prod run-prod run-debug docker-chown

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

install: ## install depedencies thanks to a local npm install
	@npm install

run-debug: ## run ezmaster in debug mode (with local mongo and nodejs and without docker)
	@DEBUG=castor*,console* NODE_ENV=development ./ezmaster

run-dev: ## run ezmaster in dev mode (with local mongo and nodejs/nodemon and without docker)
	@DEBUG=castor*,console* NODE_ENV=development ./node_modules/.bin/nodemon ./ezmaster

run-prod: ## run ezmaster in production mode (with local mongo and nodejs and without docker)
	@NODE_ENV=production ./ezmaster

docker-install: ## install depedencies thanks to a dockerized npm install
	@docker run -it --rm -v $$(pwd):/app -w /app --net=host -e NODE_ENV -e http_proxy -e https_proxy node:${NODE_VERSION} npm install
	@make docker-chown

docker-build: ## build the docker inistcnrs/ezmaster image localy
	@docker build -t inistcnrs/ezmaster --build-arg http_proxy --build-arg https_proxy .

docker-run-debug: ## run ezmaster in debug mode with dockerized nodejs and mongodb process
	@NODE_ENV=development docker-compose -f ./docker-compose.debug.yml up --force-recreate

docker-run-dev: ## run ezmaster in dev mode with dockerized nodejs/nodemon and mongodb process
	@NODE_ENV=development docker-compose -f ./docker-compose.dev.yml up --force-recreate

docker-run-prod: ## run ezmaster in production mode with the full dockerized image (see docker-build)
	@## because docker-compose.yml needs a config.local.js
	@test -f ./config.local.js || cp -f ./config.sample.js ./config.local.js
	@NODE_ENV=production docker-compose -f ./docker-compose.yml up -d --force-recreate

docker-stop-prod: ## stop ezmaster production daemon
	@NODE_ENV=production docker-compose -f ./docker-compose.yml stop

# makefile rule used to keep current user's unix rights on the docker mounted files
docker-chown:
	@test ! -d $$(pwd)/node_modules || docker run -it --rm --net=host -v $$(pwd):/app node:${NODE_VERSION} chown -R $$(id -u):$$(id -g) /app/

npm: ## npm wrapper. example: make npm install --save mongodb-querystring
	@docker run -it --rm -v $$(pwd):/app -w /app --net=host -e NODE_ENV -e http_proxy -e https_proxy node:${NODE_VERSION} npm $(filter-out $@,$(MAKECMDGOALS))
	@make docker-chown

test: ## run ezmaster unit tests
	@npm test

coverage: ## run istanbul to have how much % of the ezmaster code is covered by tests
	@./node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha -- -R spec

#lint": "jshint --exclude-path node_modes */**/*.js",
lint: ## to check the coding rules
	@./node_modules/.bin/eslint *.js heartbeats/ helpers/ loaders/ test/ views/assets/

clean: ## remove node_modules and temp files
	@rm -Rf ./node_modules/ ./npm-debug.log

