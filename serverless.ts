import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'assessment',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  // Add the serverless-webpack plugin
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    stage: '${opt:stage, "dev"}',
    runtime: 'nodejs14.x',
    lambdaHashingVersion: '20201221',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    tracing: {
      apiGateway: true,
      lambda: true,
    },
  },
  functions: {
    securityGroups: {
      name: '${self:service}-${self:provider.stage}-securityGroups',
      handler: 'handler.securityGroups',
      role: 'securityGroupsLambdaIAMRole',
      timeout: 15,
      events: [
        {
          http: {
            method: 'get',
            path: 'securityGroups',
          },
        },
      ],
    },
  },
  resources: {
    Resources: {
      securityGroupsLambdaIAMRole: {
        Type: 'AWS::IAM::Role',
        Properties: {
          Path: '/assessment/',
          AssumeRolePolicyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Principal: {
                  Service: ['lambda.amazonaws.com'],
                },
                Action: 'sts:AssumeRole',
              },
            ],
          },
          Policies: [
            {
              PolicyName: 'CloudWatchLogs',
              PolicyDocument: {
                Statement: [
                  {
                    Effect: 'Allow',
                    Action: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents'],
                    Resource: [
                      {
                        'Fn::Join': [
                          ':',
                          [
                            'arn:aws:logs',
                            { Ref: 'AWS::Region' },
                            { Ref: 'AWS::AccountId' },
                            'log-group:/aws/lambda/${self:functions.securityGroups.name}:*:*',
                          ],
                        ],
                      },
                    ],
                  },
                ],
              },
            },
            {
              PolicyName: 'xrayTracing',
              PolicyDocument: {
                Statement: [
                  {
                    Effect: 'Allow',
                    Action: [
                      'xray:PutTraceSegments',
                      'xray:PutTelemetryRecords',
                      'xray:GetSamplingRules',
                      'xray:GetSamplingTargets',
                      'xray:GetSamplingStatisticSummaries',
                    ],
                    Resource: '*',
                  },
                ],
              },
            },
            {
              PolicyName: 'listSecurityGroups',
              PolicyDocument: {
                Statement: [
                  {
                    Effect: 'Allow',
                    Action: ['ec2:DescribeSecurityGroups', 'ec2:DescribeRegions'],
                    Resource: '*',
                  },
                ],
              },
            },
          ],
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
