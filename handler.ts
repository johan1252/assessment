import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

export const hello: APIGatewayProxyHandler = async (): Promise<any> => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Hello World!',
      },
      null,
      2,
    ),
  };
};
