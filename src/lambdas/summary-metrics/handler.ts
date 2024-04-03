import { Logger } from '@aws-lambda-powertools/logger';
import { Metrics, MetricUnit } from '@aws-lambda-powertools/metrics';
import {
  GetResourcesCommand,
  GetResourcesCommandOutput,
  ResourceGroupsTaggingAPIClient,
  ResourceTagMapping,
} from '@aws-sdk/client-resource-groups-tagging-api';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Context } from 'aws-lambda';
import * as _ from 'lodash';

const logger = new Logger({});
const metrics = new Metrics({ namespace: 'tagging-metrics' });
const client = new ResourceGroupsTaggingAPIClient({ });

function tagValuesHistogram(resources: ResourceTagMapping[], tagKey: string): { count: number; value: string }[] {
  const counts = _.countBy(resources, resource => resource.Tags?.find(tag => tag.Key === tagKey)?.Value ?? 'ABSENT');

  logger.info(`counts for ${tagKey}`, { counts });

  return Object.entries(counts).map(([value, count]) => ({ value, count }));
}

export const handler = async (_event: {}, context: Context) => {
  logger.addContext(context);

  let token: string | undefined = undefined;
  do {
    const resources: GetResourcesCommandOutput = await client.send(new GetResourcesCommand({
      ResourcesPerPage: 100,
      PaginationToken: token,
    }));
    logger.info('resources', { resources });
    token = resources.PaginationToken;

    for (const tag of ['Env', 'Team']) {
      const tagHistogram = tagValuesHistogram(resources.ResourceTagMappingList ?? [], tag);
      for (const entry of tagHistogram) {
        const valueMetric = metrics.singleMetric();
        valueMetric.addDimension('Value', entry.value);
        valueMetric.addMetric(tag, MetricUnit.Count, entry.count);
      }
    }
  } while (!!token);

  return {};
};
