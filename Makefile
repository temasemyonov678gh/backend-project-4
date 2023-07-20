test:
	npx jest test
install:
	npm ci
link:
	npm link
lint:
	npx eslint .
jest:
	NODE_OPTIONS=--experimental-vm-modules npx jest --coverage
