# Developing

## Getting started

To get started developing in this project you'll first want to install the Javascript packages.
This can be done by running:

```
npm ci
```

## Linting

Three tools are used in this project to ensure code is ready for deployment.

- [ESLint](https://eslint.org/) is used for typescript linting.
- [Prettier](https://prettier.io/) is used for code formatting.
- [Typescript](https://www.typescriptlang.org/docs/handbook/compiler-options.html) compilation with --noEmit flag is used to ensure the code compiles.

To run all three tools on your code, simply run:

```
npm run lint
```

If Prettier has findings, you can run `npm run fix` to automatically fix formatting issues.
Note that ESlint will also automatically run when doing your deployment through `serverless` as well due to the `ForkTsCheckerWebpackPlugin` plugin in `webpack.config.js` file.

## Testing

The unit tests for this project can be found in `*.test.ts` files.
Mocking of AWS SDK is done using [aws-sdk-client-mock](https://github.com/m-radzikowski/aws-sdk-client-mock). This mocking library was chosen as it supports [AWS SDK for JavaScript version 3](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/welcome.html) which has the benefits of a modular architecture and improved typing.
This project aims to have test coverage as close to 100% of statements as possible. PR's may be rejected if test coverage is too low.

### Running unit tests

`npm t` or `npm run tests`

### Running unit tests for a single file

If you only want to run authHandler unit tests, the following could be used:
`npm t -- authHandler.test.ts`

### Getting code coverage

`npm run coverage`

Example output:

```
------------|---------|----------|---------|---------|-------------------
File        | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
------------|---------|----------|---------|---------|-------------------
All files   |     100 |      100 |     100 |     100 |
 handler.ts |     100 |      100 |     100 |     100 |
------------|---------|----------|---------|---------|-------------------
Test Suites: 1 passed, 1 total
Tests:       8 passed, 8 total
Snapshots:   0 total
Time:        6.204 s, estimated 7 s
```

### Getting code coverage for a single file

If you only want to get code coverage for authHandler, the following could be used:
`npm run coverage -- authHandler.test.ts `

## Deployment

```
npx sls deploy --stage <stageName>
```
