import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { EC2Client, paginateDescribeSecurityGroups, DescribeRegionsCommand } from '@aws-sdk/client-ec2';

async function getRegions() {
  const client = new EC2Client({ region: 'us-east-1' });
  const command = new DescribeRegionsCommand({});

  const data = await client.send(command);
  return data.Regions;
}

async function getAllSecurityGroups() {
  let regions;
  try {
    regions = await getRegions();
    console.log('Fetched all active regions', regions);
  } catch (e) {
    console.error('Encountered error while retrieving regions', e);
    return null;
  }

  try {
    const data = new Map();
    for (const region of regions) {
      const paginatorConfig = {
        client: new EC2Client({ region: region.RegionName }),
        pageSize: 25,
      };
      const paginator = paginateDescribeSecurityGroups(paginatorConfig, {});

      const securityGroups = [];
      for await (const page of paginator) {
        securityGroups.push(...page.SecurityGroups);
      }
      data[region.RegionName] = { securityGroups: securityGroups };
    }
    return data;
  } catch (e) {
    console.error('Encountered error while retrieving security groups', e);
    return null;
  }
}

export const securityGroups: APIGatewayProxyHandler = async () => {
  const regionalSGData = await getAllSecurityGroups();
  if (regionalSGData == null) {
    console.error('Returning error to user');
    return {
      statusCode: 500,
      body: JSON.stringify(
        {
          errors: [
            {
              title:
                'An error occurred while retrieving security groups. If this issue continues please create a support case.',
            },
          ],
        },
        null,
        2,
      ),
    };
  }
  console.log('Fetched all security group data', regionalSGData);

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        data: {
          regions: regionalSGData,
        },
      },
      null,
      2,
    ),
  };
};
