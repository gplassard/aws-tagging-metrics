import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { PipelineStack } from '../../src/stacks/PipelineStack';

describe('PipelineStack', () => {
  it('should produce the expected cloudformation', () => {
    const app = new App();
    const stack = new PipelineStack(app, 'PipelineStack', {
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
