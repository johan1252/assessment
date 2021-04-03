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

## Deployment 

```
npx sls deploy --stage <stageName>
```