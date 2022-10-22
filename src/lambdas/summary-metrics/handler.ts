import { Logger } from '@aws-lambda-powertools/logger';
import { Metrics } from '@aws-lambda-powertools/metrics';
import { GetComplianceSummaryCommand, ResourceGroupsTaggingAPIClient } from '@aws-sdk/client-resource-groups-tagging-api';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Context } from 'aws-lambda';

const logger = new Logger({ });
const metrics = new Metrics({ namespace: 'tagging-metrics' });
const client = new ResourceGroupsTaggingAPIClient({ region: 'us-east-1' }); // only available in us-east-1

export const handler = async (_event: {}, context: Context) => {
  logger.addContext(context);
  logger.info('hello world');

  const complianceSummary = await client.send(new GetComplianceSummaryCommand({}));
  logger.info('compliance summary', { complianceSummary });

  metrics.publishStoredMetrics(); //TODO
  return { summary: complianceSummary.SummaryList, token: complianceSummary.PaginationToken };
};
