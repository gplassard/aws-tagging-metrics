import { App } from 'aws-cdk-lib';
import { TaggingMetricsStack } from './stacks/TaggingMetricsStack';

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

// deploy this app to deploy it without the pipeline stack (cdk metadata will change)
const app = new App();

new TaggingMetricsStack(app, 'stack', {
  env: devEnv,
  baseName: 'aws-tagging-metrics',
  tags: {
    Env: 'dev',
    Team: 'a',
  },
});

app.synth();
