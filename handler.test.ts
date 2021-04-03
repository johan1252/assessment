import { mockClient } from 'aws-sdk-client-mock';
import { EC2Client, DescribeSecurityGroupsCommand, DescribeRegionsCommand } from '@aws-sdk/client-ec2';
import { securityGroups } from './handler';
import { APIGatewayProxyResult } from 'aws-lambda';

const ec2Mock = mockClient(EC2Client);

/**
 * To be sure that unit tests are independent from each other,
 * reset mock behavior between the tests.
 */
beforeEach(() => {
  ec2Mock.reset();
});

const mockValidRegions = () => {
  ec2Mock.on(DescribeRegionsCommand).resolves({
    Regions: [
      {
        Endpoint: 'ec2.eu-north-1.amazonaws.com',
        RegionName: 'eu-north-1',
        OptInStatus: 'opt-in-not-required',
      },
      {
        Endpoint: 'ec2.ap-south-1.amazonaws.com',
        RegionName: 'ap-south-1',
        OptInStatus: 'opt-in-not-required',
      },
      {
        Endpoint: 'ec2.eu-west-3.amazonaws.com',
        RegionName: 'eu-west-3',
        OptInStatus: 'opt-in-not-required',
      },
      {
        Endpoint: 'ec2.eu-west-2.amazonaws.com',
        RegionName: 'eu-west-2',
        OptInStatus: 'opt-in-not-required',
      },
      {
        Endpoint: 'ec2.eu-west-1.amazonaws.com',
        RegionName: 'eu-west-1',
        OptInStatus: 'opt-in-not-required',
      },
      {
        Endpoint: 'ec2.ap-northeast-3.amazonaws.com',
        RegionName: 'ap-northeast-3',
        OptInStatus: 'opt-in-not-required',
      },
      {
        Endpoint: 'ec2.ap-northeast-2.amazonaws.com',
        RegionName: 'ap-northeast-2',
        OptInStatus: 'opt-in-not-required',
      },
      {
        Endpoint: 'ec2.ap-northeast-1.amazonaws.com',
        RegionName: 'ap-northeast-1',
        OptInStatus: 'opt-in-not-required',
      },
      {
        Endpoint: 'ec2.sa-east-1.amazonaws.com',
        RegionName: 'sa-east-1',
        OptInStatus: 'opt-in-not-required',
      },
      {
        Endpoint: 'ec2.ca-central-1.amazonaws.com',
        RegionName: 'ca-central-1',
        OptInStatus: 'opt-in-not-required',
      },
      {
        Endpoint: 'ec2.ap-southeast-1.amazonaws.com',
        RegionName: 'ap-southeast-1',
        OptInStatus: 'opt-in-not-required',
      },
      {
        Endpoint: 'ec2.ap-southeast-2.amazonaws.com',
        RegionName: 'ap-southeast-2',
        OptInStatus: 'opt-in-not-required',
      },
      {
        Endpoint: 'ec2.eu-central-1.amazonaws.com',
        RegionName: 'eu-central-1',
        OptInStatus: 'opt-in-not-required',
      },
      {
        Endpoint: 'ec2.us-east-1.amazonaws.com',
        RegionName: 'us-east-1',
        OptInStatus: 'opt-in-not-required',
      },
      {
        Endpoint: 'ec2.us-east-2.amazonaws.com',
        RegionName: 'us-east-2',
        OptInStatus: 'opt-in-not-required',
      },
      {
        Endpoint: 'ec2.us-west-1.amazonaws.com',
        RegionName: 'us-west-1',
        OptInStatus: 'opt-in-not-required',
      },
      {
        Endpoint: 'ec2.us-west-2.amazonaws.com',
        RegionName: 'us-west-2',
        OptInStatus: 'opt-in-not-required',
      },
    ],
  });
};

const mockNoRegions = () => {
  ec2Mock.on(DescribeRegionsCommand).resolves({
    Regions: [],
  });
};

const mockErrorRegions = () => {
  ec2Mock.on(DescribeRegionsCommand).rejects(new Error('AWS server side error occurred'));
};

const mockNoSecurityGroups = () => {
  ec2Mock.on(DescribeSecurityGroupsCommand).resolves({
    SecurityGroups: [],
    NextToken: undefined,
  });
};

const testSecurityGroup = {
  Description: 'default VPC security group',
  GroupName: 'default',
  IpPermissions: [
    {
      IpProtocol: '-1',
      IpRanges: [],
      Ipv6Ranges: [],
      PrefixListIds: [],
      UserIdGroupPairs: [
        {
          GroupId: 'sg-eef2d58e',
          UserId: '895140693851',
        },
      ],
    },
  ],
  OwnerId: '895140693851',
  GroupId: 'sg-eef2d58e',
  IpPermissionsEgress: [
    {
      IpProtocol: '-1',
      IpRanges: [
        {
          CidrIp: '0.0.0.0/0',
        },
      ],
      Ipv6Ranges: [],
      PrefixListIds: [],
      UserIdGroupPairs: [],
    },
  ],
  VpcId: 'vpc-e9c47880',
};

const testSecurityGroup2 = {
  Description: 'default VPC security group',
  GroupName: 'default',
  IpPermissions: [
    {
      IpProtocol: '-1',
      IpRanges: [],
      Ipv6Ranges: [],
      PrefixListIds: [],
      UserIdGroupPairs: [
        {
          GroupId: 'sg-eef2d58e',
          UserId: '895140693851',
        },
      ],
    },
  ],
  OwnerId: '895140693851',
  GroupId: 'sg-eef2d58e',
  IpPermissionsEgress: [
    {
      IpProtocol: '-1',
      IpRanges: [
        {
          CidrIp: '0.0.0.0/0',
        },
      ],
      Ipv6Ranges: [],
      PrefixListIds: [],
      UserIdGroupPairs: [],
    },
  ],
  VpcId: 'vpc-e9c47880',
};

const mockOneSecurityGroups = () => {
  ec2Mock.on(DescribeSecurityGroupsCommand).resolves({
    SecurityGroups: [testSecurityGroup],
    NextToken: undefined,
  });
};

const mockPagingSecurityGroups = () => {
  ec2Mock.on(DescribeSecurityGroupsCommand).resolves({
    SecurityGroups: [testSecurityGroup],
    NextToken: 'gdslksdkgsdjkgjdk',
  });
  ec2Mock.on(DescribeSecurityGroupsCommand, { MaxResults: 25, NextToken: 'gdslksdkgsdjkgjdk' }).resolves({
    SecurityGroups: [testSecurityGroup2],
    NextToken: undefined,
  });
};

const mockErrorSecurityGroups = () => {
  ec2Mock.on(DescribeSecurityGroupsCommand).rejects(new Error('AWS server side error occurred'));
};

describe('Region tests', function () {
  it('Valid regions - no security groups', async () => {
    mockValidRegions();
    mockNoSecurityGroups();

    const result = await securityGroups(null, null, null);
    expect(result).toBeDefined;
    const body = (result as APIGatewayProxyResult).body;
    const parsedBody = JSON.parse(body);
    expect(parsedBody).toHaveProperty('data');
    expect(parsedBody.data).toHaveProperty('regions');
    expect(parsedBody.data.regions).toHaveProperty('us-east-1');
    expect(parsedBody.data.regions['us-east-1']).toHaveProperty('securityGroups');
    expect(parsedBody.data.regions['us-east-1'].securityGroups).toHaveLength(0);
  });
  it('Valid regions - 1 security group per region', async () => {
    mockValidRegions();
    mockOneSecurityGroups();

    const result = await securityGroups(null, null, null);
    expect(result).toBeDefined;
    const body = (result as APIGatewayProxyResult).body;
    const parsedBody = JSON.parse(body);
    expect(parsedBody).toHaveProperty('data');
    expect(parsedBody.data).toHaveProperty('regions');
    expect(parsedBody.data.regions).toHaveProperty('us-east-1');
    expect(parsedBody.data.regions['us-east-1']).toHaveProperty('securityGroups');
    expect(parsedBody.data.regions['us-east-1'].securityGroups).toHaveLength(1);
    expect(parsedBody.data.regions['us-east-1'].securityGroups[0]).toEqual(testSecurityGroup);
  });
  it('No available regions', async () => {
    mockNoRegions();
    mockNoSecurityGroups();

    const result = await securityGroups(null, null, null);
    expect(result).toBeDefined;
    const body = (result as APIGatewayProxyResult).body;
    const parsedBody = JSON.parse(body);
    expect(parsedBody).toHaveProperty('data');
    expect(parsedBody.data).toHaveProperty('regions');
    expect(parsedBody.data.regions).toEqual({});
  });
  it('AWS error getting regions', async () => {
    mockErrorRegions();
    mockNoSecurityGroups();

    const result = await securityGroups(null, null, null);
    expect(result).toBeDefined;
    const body = (result as APIGatewayProxyResult).body;
    const parsedBody = JSON.parse(body);
    expect(parsedBody).toHaveProperty('errors');
    expect(parsedBody.errors).toHaveLength(1);
    expect(parsedBody.errors[0]).toHaveProperty('title');
    expect(parsedBody.errors[0].title).toEqual(
      'An error occurred while retrieving security groups. If this issue continues please create a support case.',
    );
  });
});

describe('Security group tests', function () {
  it('No security groups', async () => {
    mockValidRegions();
    mockNoSecurityGroups();

    const result = await securityGroups(null, null, null);
    expect(result).toBeDefined;
    const body = (result as APIGatewayProxyResult).body;
    const parsedBody = JSON.parse(body);
    expect(parsedBody).toHaveProperty('data');
    expect(parsedBody.data).toHaveProperty('regions');
    expect(parsedBody.data.regions).toHaveProperty('us-east-1');
    expect(parsedBody.data.regions['us-east-1']).toHaveProperty('securityGroups');
    expect(parsedBody.data.regions['us-east-1'].securityGroups).toHaveLength(0);
  });
  it('1 security group per region', async () => {
    mockValidRegions();
    mockOneSecurityGroups();

    const result = await securityGroups(null, null, null);
    expect(result).toBeDefined;
    const body = (result as APIGatewayProxyResult).body;
    const parsedBody = JSON.parse(body);
    expect(parsedBody).toHaveProperty('data');
    expect(parsedBody.data).toHaveProperty('regions');
    expect(parsedBody.data.regions).toHaveProperty('us-east-1');
    expect(parsedBody.data.regions['us-east-1']).toHaveProperty('securityGroups');
    expect(parsedBody.data.regions['us-east-1'].securityGroups).toHaveLength(1);
    expect(parsedBody.data.regions['us-east-1'].securityGroups[0]).toEqual(testSecurityGroup);
  });
  it('Security group paging', async () => {
    mockValidRegions();
    mockPagingSecurityGroups();

    const result = await securityGroups(null, null, null);
    expect(result).toBeDefined;
    const body = (result as APIGatewayProxyResult).body;
    const parsedBody = JSON.parse(body);
    expect(parsedBody).toHaveProperty('data');
    expect(parsedBody.data).toHaveProperty('regions');
    expect(parsedBody.data.regions).toHaveProperty('us-east-1');
    expect(parsedBody.data.regions['us-east-1']).toHaveProperty('securityGroups');
    expect(parsedBody.data.regions['us-east-1'].securityGroups).toHaveLength(2);
    // SG from first page of AWS SDK results
    expect(parsedBody.data.regions['us-east-1'].securityGroups[0]).toEqual(testSecurityGroup);
    // SG from second page of AWS SDK results
    expect(parsedBody.data.regions['us-east-1'].securityGroups[1]).toEqual(testSecurityGroup2);
  });
  it('AWS error getting security groups', async () => {
    mockValidRegions();
    mockErrorSecurityGroups();

    const result = await securityGroups(null, null, null);
    expect(result).toBeDefined;
    const body = (result as APIGatewayProxyResult).body;
    const parsedBody = JSON.parse(body);
    expect(parsedBody).toHaveProperty('errors');
    expect(parsedBody.errors).toHaveLength(1);
    expect(parsedBody.errors[0]).toHaveProperty('title');
    expect(parsedBody.errors[0].title).toEqual(
      'An error occurred while retrieving security groups. If this issue continues please create a support case.',
    );
  });
});
