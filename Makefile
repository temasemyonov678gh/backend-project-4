test:
	npx jest test
test-axios-debug:
	DEBUG=axios npx jest test
test-nock-debug:
	DEBUG=nock.* npx jest test
test-debug:
	DEBUG=page-loader npx jest test
test-coverage:
	npx jest test --coverage
install:
	npm ci
link:
	npm link
lint:
	npx eslint .
jest:
	NODE_OPTIONS=--experimental-vm-modules npx jest --coverage
