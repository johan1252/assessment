import { APIGatewayTokenAuthorizerEvent, Context, Callback } from 'aws-lambda';
import 'source-map-support/register';

export interface AuthorizerContext {
  Email: string;
}

export const customAuthorizer = (
  event: APIGatewayTokenAuthorizerEvent,
  _context: Context,
  callback: Callback,
): void => {
  // Deny by default
  let policy = generatePolicy('anonymous', 'Deny', event.methodArn);
  const headerValue = event.authorizationToken.trim();
  console.log('Received Authorization header');

  if (headerValue.startsWith('Bearer ')) {
    const token = headerValue.substring(7, headerValue.length);
    // Future improvement: Add lookup in an identity management system
    if (token == 'superSecretToken') {
      const context: AuthorizerContext = {
        // Can be used in downstream lambda if desired
        Email: 'placeholderemail@gmail.com',
      };
      policy = generatePolicy('placeholderID', 'Allow', event.methodArn, context);
      console.log('Authorized request');
    }
  }

  callback(null, policy);
};

const generatePolicy = (principalId: string, effect: string, resource: string, context?: any): any => {
  const authResponse: any = {};

  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument: any = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    const statementOne: any = {};
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }

  if (context) {
    authResponse.context = context;
  }

  return authResponse;
};
