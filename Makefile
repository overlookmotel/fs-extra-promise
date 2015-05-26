REPORTER ?= spec
TESTS = $(shell find ./test/* -name "*.test.js")

# test commands

teaser:
	@echo "" && \
	node -pe "Array(18).join('#')" && \
	echo '# Running tests #' && \
	node -pe "Array(18).join('#')" && \
	echo ''

test:
	@if [ "$$GREP" ]; then \
		make jshint && make teaser && ./node_modules/mocha/bin/mocha --check-leaks --colors -t 10000 --reporter $(REPORTER) -g "$$GREP" $(TESTS); \
	else \
		make jshint && make teaser && ./node_modules/mocha/bin/mocha --check-leaks --colors -t 10000 --reporter $(REPORTER) $(TESTS); \
	fi

jshint:
	./node_modules/.bin/jshint lib test

.PHONY: test
