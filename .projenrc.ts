import { TypescriptApplicationProject } from '@gplassard/projen-extensions';

const project = new TypescriptApplicationProject({
  name: 'aws-tagging-metrics',
  deps: [
    '@aws-sdk/client-resource-groups-tagging-api', '@aws-lambda-powertools/metrics', '@aws-lambda-powertools/logger', 'lodash', 'aws-cdk-lib', 'constructs',
  ],
  devDeps: [
    '@types/aws-lambda', '@types/lodash', 'aws-cdk', 'esbuild',
  ],
  scripts: {
    'cdk:deploy': 'yarn cdk --app "ts-node ./src/main.ts" deploy',
    'cdk:diff': 'yarn cdk --app "ts-node ./src/main.ts" diff',
    'cdk:synth': 'yarn cdk --app "ts-node ./src/main.ts" synth',
    'cdk:destroy': 'yarn cdk --app "ts-node ./src/main.ts" destroy',
    'cdk:local:deploy': 'yarn cdk --app "ts-node ./src/local-deploy.ts" deploy',
    'cdk:local:diff': 'yarn cdk --app "ts-node ./src/local-deploy.ts" diff',
    'cdk:local:synth': 'yarn cdk --app "ts-node ./src/local-deploy.ts" synth',
    'cdk:local:destroy': 'yarn cdk --app "ts-node ./src/local-deploy.ts" destroy',
  },
  gitignore: ['cdk.out'],
  tsconfig: {
    compilerOptions: {
      skipLibCheck: true,
    },
    exclude: ['cdk.out'],
  },
});
project.addPackageIgnore('cdk.out');
project.synth();
