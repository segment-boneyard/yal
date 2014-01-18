
test:
	@NODE_ENV=test LOG_LEVEL=debug ./node_modules/.bin/mocha \
		--reporter spec \
		--bail

.PHONY: test