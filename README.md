# assessment

This project was created for the `API Gateway + Lambda` technical assessment. The project contains an AWS API Gateway endpoint that returns all security groups present in the account and is secured using an AWS API Gateway Custom Authorizer. The project uses Typescript on Node.js 14.x and uses ESLint, prettier, and Jest for quality assurance. Automated builds are orchestrated using Github actions.

## Getting Started

### Deployment

This project used the [serverless framework](https://www.serverless.com/) for deploying it's application code and infrastructure. To deploy (fresh deploy or upgrade) simply run the following command:

```
npx sls deploy --stage <stageName>
```

Note - Ensure your AWS credentials are pointing to the desired account.

### Custom Authorizer

An [AWS custom authorizer](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html) is used to authorize all requests sent to the `GET /securityGroups` endpoint. Requests will be rejected if the request does not contain the appropriate `Authorization` header. For demonstration purposes the endpoint will currently only allow requests with the following header value: `Authorization: Bearer superSecretToken`.
If desired the authorizer `context` field can be used to pass authenticated user information to the downstream endpoint (example a user's email address, unique identifier etc.).

### Calling API

The API can be called using any client that supports HTTPS API calls.
The endpoint to use can be found in the serverless deployment output.
Example using curl:

```
curl -H 'Authorization: Bearer superSecretToken' https://n4qb6jwdag.execute-api.us-east-1.amazonaws.com/johanc/securityGroups
```

### Sample output

`GET /securityGroups` will return JSON compliant data with security groups found in each active AWS region. Sample data can be seen below.

```json
{
  "data": {
    "regions": {
      "eu-north-1": {
        "securityGroups": [
          {
            "Description": "default VPC security group",
            "GroupName": "default",
            "IpPermissions": [
              {
                "IpProtocol": "-1",
                "IpRanges": [],
                "Ipv6Ranges": [],
                "PrefixListIds": [],
                "UserIdGroupPairs": [
                  {
                    "GroupId": "sg-eef2d58e",
                    "UserId": "895140693851"
                  }
                ]
              }
            ],
            "OwnerId": "895140693851",
            "GroupId": "sg-eef2d58e",
            "IpPermissionsEgress": [
              {
                "IpProtocol": "-1",
                "IpRanges": [
                  {
                    "CidrIp": "0.0.0.0/0"
                  }
                ],
                "Ipv6Ranges": [],
                "PrefixListIds": [],
                "UserIdGroupPairs": []
              }
            ],
            "VpcId": "vpc-e9c47880"
          }
        ]
      },
      "ap-south-1": {
        "securityGroups": [
          ....
        ]
      },
      ...
      ]
    }
  }
}
```

## Future enhancements

1. Add caching of data to improve API performance
   1. Lambda memory? (helps with subsequent "warm" requests)
   1. Elasticache or Redis?
1. Add ability to store and retrieve API keys for use in custom authorizer
   1. DynamoDB as backend?
   1. JWT tokens?
   1. Integrate with single sign-on systems like Auth0?
1. Handle 10Mb max payload size restriction by API Gateway (see [AWS docs](https://docs.aws.amazon.com/apigateway/latest/developerguide/limits.html))
   1. Currently we assume that the total number of security groups in an account won't exceed a returned payload of 10Mb. This may not be true for large AWS accounts with lots of resources.
   1. Pagination can be introduced to help ensure responses are always within the allowed limits.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to this project!
