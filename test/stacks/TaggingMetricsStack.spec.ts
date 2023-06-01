import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { TaggingMetricsStack } from '../../src/stacks/TaggingMetricsStack';

describe('TaggingMetricsStack', () => {
  it('should produce the expected cloudformation', () => {
    const app = new App();
    const stack = new TaggingMetricsStack(app, 'TaggingMetricsStack', {
      baseName: 'stack',
      tags: {
        Env: 'dev',
        Team: 'team',
      },
    });

    const template = Template.fromStack(stack);
    expect(template.toJSON()).toMatchSnapshot();
  });
});
