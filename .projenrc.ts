import { AwsCdkTypeScriptApp } from 'projen/lib/awscdk';
import { GithubCredentials } from 'projen/lib/github';
import { UpgradeDependenciesSchedule } from 'projen/lib/javascript';

const project = new AwsCdkTypeScriptApp({
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
  name: 'aws-tagging-metrics',
  projenrcTs: true,
  githubOptions: {
    mergify: false,
    projenCredentials: GithubCredentials.fromPersonalAccessToken({ secret: 'GITHUB_TOKEN' }),
  },
  gitignore: ['*.iml', '.idea', '.vscode'],
  sampleCode: false,
  jestOptions: {
    configFilePath: 'jest.config.json',
  },
  depsUpgradeOptions: {
    workflowOptions: {
      labels: ['dependencies'],
      schedule: UpgradeDependenciesSchedule.MONTHLY,
    },
  },
  deps: [
    '@aws-sdk/client-resource-groups-tagging-api', '@aws-lambda-powertools/metrics', '@aws-lambda-powertools/logger', 'lodash',
  ],
  devDeps: [
    '@types/aws-lambda', '@types/lodash',
  ],
  scripts: {
    'cdk:local:deploy': 'yarn cdk --app "ts-node ./src/local-deploy.ts" deploy',
    'cdk:local:diff': 'yarn cdk --app "ts-node ./src/local-deploy.ts" diff',
    'cdk:local:synth': 'yarn cdk --app "ts-node ./src/local-deploy.ts" synth',
    'cdk:local:destroy': 'yarn cdk --app "ts-node ./src/local-deploy.ts" destroy',
  },
});
project.synth();
