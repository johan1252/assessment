import { customAuthorizer, AuthorizerContext } from './authHandler';
import { APIGatewayTokenAuthorizerEvent, APIGatewayAuthorizerResult } from 'aws-lambda';

// Use local interface as the one from 'aws-lambda' TS package is incomplete.
interface AWSAuthorizerStatement {
  Effect: string;
  Action?: string | string[];
  Resource?: string | string[];
}

const testMethodArn = 'arn:aws:execute-api:us-east-1:895140693851:n4qb6jwdag/johanc/GET/securityGroups';
const testAuthType = 'TOKEN';

describe('Custom Authorizer tests', function () {
  it('Valid authorization token', (done) => {
    function callback(error, data) {
      try {
        expect(error).toBe(null);
        expect(data).toBeDefined;
        const authorizerResult = data as APIGatewayAuthorizerResult;
        expect(authorizerResult).toHaveProperty('principalId');
        expect(authorizerResult.principalId).toEqual('placeholderID');
        expect(authorizerResult).toHaveProperty('policyDocument');
        expect(authorizerResult.policyDocument).toHaveProperty('Statement');
        expect(authorizerResult.policyDocument.Statement).toHaveLength(1);
        const authStatement = authorizerResult.policyDocument.Statement[0] as AWSAuthorizerStatement;
        expect(authStatement.Action).toEqual('execute-api:Invoke');
        expect(authStatement.Resource).toEqual(testMethodArn);
        expect(authStatement.Effect).toEqual('Allow');
        expect(authorizerResult).toHaveProperty('context');
        const expectedContext: AuthorizerContext = {
          Email: 'placeholderemail@gmail.com',
        };
        expect(authorizerResult.context).toEqual(expectedContext);
        done();
      } catch (error) {
        done(error);
      }
    }

    const inputEvent: APIGatewayTokenAuthorizerEvent = {
      authorizationToken: 'Bearer superSecretToken',
      methodArn: testMethodArn,
      type: testAuthType,
    };
    customAuthorizer(inputEvent, null, callback);
  });
  it('Invalid authorization token', (done) => {
    function callback(error, data) {
      try {
        expect(error).toBe(null);
        expect(data).toBeDefined;
        const authorizerResult = data as APIGatewayAuthorizerResult;
        expect(authorizerResult).toHaveProperty('principalId');
        expect(authorizerResult.principalId).toEqual('anonymous');
        expect(authorizerResult).toHaveProperty('policyDocument');
        expect(authorizerResult.policyDocument).toHaveProperty('Statement');
        expect(authorizerResult.policyDocument.Statement).toHaveLength(1);
        const authStatement = authorizerResult.policyDocument.Statement[0] as AWSAuthorizerStatement;
        expect(authStatement.Effect).toEqual('Deny');
        done();
      } catch (error) {
        done(error);
      }
    }

    const inputEvent: APIGatewayTokenAuthorizerEvent = {
      authorizationToken: 'Bearer notTheToken',
      methodArn: testMethodArn,
      type: testAuthType,
    };
    customAuthorizer(inputEvent, null, callback);
  });
  it('Missing authorization token', (done) => {
    function callback(error, data) {
      try {
        expect(error).toBe(null);
        expect(data).toBeDefined;
        const authorizerResult = data as APIGatewayAuthorizerResult;
        expect(authorizerResult).toHaveProperty('principalId');
        expect(authorizerResult.principalId).toEqual('anonymous');
        expect(authorizerResult).toHaveProperty('policyDocument');
        expect(authorizerResult.policyDocument).toHaveProperty('Statement');
        expect(authorizerResult.policyDocument.Statement).toHaveLength(1);
        const authStatement = authorizerResult.policyDocument.Statement[0] as AWSAuthorizerStatement;
        expect(authStatement.Effect).toEqual('Deny');
        done();
      } catch (error) {
        done(error);
      }
    }

    const inputEvent: APIGatewayTokenAuthorizerEvent = {
      authorizationToken: 'Bearer',
      methodArn: testMethodArn,
      type: testAuthType,
    };
    customAuthorizer(inputEvent, null, callback);
  });
  it('Missing Bearer scheme', (done) => {
    function callback(error, data) {
      try {
        expect(error).toBe(null);
        expect(data).toBeDefined;
        const authorizerResult = data as APIGatewayAuthorizerResult;
        expect(authorizerResult).toHaveProperty('principalId');
        expect(authorizerResult.principalId).toEqual('anonymous');
        expect(authorizerResult).toHaveProperty('policyDocument');
        expect(authorizerResult.policyDocument).toHaveProperty('Statement');
        expect(authorizerResult.policyDocument.Statement).toHaveLength(1);
        const authStatement = authorizerResult.policyDocument.Statement[0] as AWSAuthorizerStatement;
        expect(authStatement.Effect).toEqual('Deny');
        done();
      } catch (error) {
        done(error);
      }
    }

    const inputEvent: APIGatewayTokenAuthorizerEvent = {
      authorizationToken: 'superSecretToken',
      methodArn: testMethodArn,
      type: testAuthType,
    };
    customAuthorizer(inputEvent, null, callback);
  });
  it('Empty header value', (done) => {
    function callback(error, data) {
      try {
        expect(error).toBe(null);
        expect(data).toBeDefined;
        const authorizerResult = data as APIGatewayAuthorizerResult;
        expect(authorizerResult).toHaveProperty('principalId');
        expect(authorizerResult.principalId).toEqual('anonymous');
        expect(authorizerResult).toHaveProperty('policyDocument');
        expect(authorizerResult.policyDocument).toHaveProperty('Statement');
        expect(authorizerResult.policyDocument.Statement).toHaveLength(1);
        const authStatement = authorizerResult.policyDocument.Statement[0] as AWSAuthorizerStatement;
        expect(authStatement.Effect).toEqual('Deny');
        done();
      } catch (error) {
        done(error);
      }
    }

    const inputEvent: APIGatewayTokenAuthorizerEvent = {
      authorizationToken: '',
      methodArn: testMethodArn,
      type: testAuthType,
    };
    customAuthorizer(inputEvent, null, callback);
  });
});
