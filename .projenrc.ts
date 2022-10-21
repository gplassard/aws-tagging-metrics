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
});
project.synth();
