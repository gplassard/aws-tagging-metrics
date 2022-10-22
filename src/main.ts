import { App } from 'aws-cdk-lib';
import { TaggingMetricsStack } from './stacks/TaggingMetricsStack';

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new TaggingMetricsStack(app, 'aws-tagging-metrics-dev', {
  env: devEnv,
  baseName: 'aws-tagging-metrics',
  tags: {
    Env: 'dev',
    Team: 'a',
  },
});

app.synth();
