import { App, CfnDynamicReference, CfnDynamicReferenceService, SecretValue, Stack, StackProps, Stage } from 'aws-cdk-lib';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { TaggingMetricsStack } from './TaggingMetricsStack';

export interface Props extends StackProps {
  baseName: string;
  tags: {
    Env: string;
    Team: string;
  };
}


export class PipelineStack extends Stack {
  constructor(app: App, id: string, props: Props) {
    super(app, id, {
      stackName: `${props.baseName}-pipeline-${props.tags.Env}`,
      tags: props.tags,
    });

    const pipeline = new CodePipeline(this, 'pipeline', {
      pipelineName: `${props.baseName}-pipeline-${props.tags.Env}`,
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('gplassard/aws-tagging-metrics', 'main', {
          authentication: SecretValue.cfnDynamicReference(new CfnDynamicReference(CfnDynamicReferenceService.SSM, 'github-gplassard-oauth')),
        }),
        commands: ['yarn synth'],
      }),
    });

    const stage = new Stage(this, 'stage', {});
    new TaggingMetricsStack(stage, 'stack', props);
    pipeline.addStage(stage);
  }
}
