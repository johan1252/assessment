# assessment

## Getting Started

### Deployment 

```
npx sls deploy --stage <stageName>
```

### Calling API
The API can be called using any client that supports HTTPS API calls.
The endpoint to use can be found in the serverless deployment output.
Example using curl:
```
curl https://n4qb6jwdag.execute-api.us-east-1.amazonaws.com/johanc/securityGroups
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

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to this project.