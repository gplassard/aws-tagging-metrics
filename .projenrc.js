const { awscdk } = require('projen');
const { GithubCredentials } = require('projen/lib/github');
const { UpgradeDependenciesSchedule } = require('projen/lib/javascript');

const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
  name: 'aws-tagging-metrics',
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
});
project.synth();
