import path from 'path';
import { Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Architecture } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

export interface Props extends StackProps {
  baseName: string;
  tags: {
    Env: string;
    Team: string;
  };
}

export class TaggingMetricsStack extends Stack {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, {
      stackName: `${props.baseName}-${props.tags.Env}`,
      tags: props.tags,
    });

    const functionName = `${props.baseName}-summary-metrics-exporter-${props.tags.Env}`;
    const summaryMetricsExporter = new NodejsFunction(this, 'summary-metrics-exporter', {
      functionName,
      entry: path.join(__dirname, '../lambdas/summary-metrics/handler.ts'),
      architecture: Architecture.ARM_64,
      timeout: Duration.seconds(60),
      memorySize: 512,
      initialPolicy: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ['tag:GetResources'],
          resources: ['*'],
        }),
      ],
    });
    const logGroup = new LogGroup(this, 'summary-metrics-exporter-logs', {
      logGroupName: `/aws/lambda/${functionName}`,
      retention: RetentionDays.ONE_WEEK,
      removalPolicy: RemovalPolicy.DESTROY,
    });
    summaryMetricsExporter.node.addDependency(logGroup);
  }
}
