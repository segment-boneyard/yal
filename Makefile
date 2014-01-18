
test: node_modules
	@NODE_ENV=test LOG_LEVEL=debug ./node_modules/.bin/mocha \
		--reporter spec \
		--bail

node_modules: package.json
	@npm install

.PHONY: test