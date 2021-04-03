import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { EC2Client, paginateDescribeSecurityGroups, DescribeRegionsCommand } from '@aws-sdk/client-ec2';

async function getRegions() {
  const client = new EC2Client({ region: 'us-east-1' });
  const command = new DescribeRegionsCommand({});

  try {
    const data = await client.send(command);
    return data.Regions;
  } catch (error) {
    return error;
  }
}

async function getAllSecurityGroups() {
  const regions = await getRegions();
  console.log('Fetched all active regions', regions);

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
}

export const securityGroups: APIGatewayProxyHandler = async () => {
  const regionalSGData = await getAllSecurityGroups();
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
