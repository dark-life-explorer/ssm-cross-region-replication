import { App, Stack, StackProps, CustomResource } from "aws-cdk-lib";

import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

import { Provider } from "aws-cdk-lib/custom-resources";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";

import {
  SSM_REPLICATION_CONFIG as Config,
  SSM_PARAMETERS_CONFIG,
} from "../consts";

/**
 * The stack creates Lambda function that will copy parameter store values from one region and copy into another.
 */
export class SSMReplicationStack extends Stack {
  public constructor(scope: App, id: string, props: StackProps) {
    super(scope, id, props);

    /**
     * Create Lambda Function that will copy parameter store values from.
     */
    const replicateValuesFunction = new NodejsFunction(
      this,
      "replication-lambda-resource",
      {
        entry: `${__dirname}/../../src/index.ts`,
        functionName: Config.LAMBDA_REPLICATION_NAME,
      }
    );

    /**
     * Allow to read values from us-east-1 region.
     */
    replicateValuesFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["ssm:GetParameter"],
        resources: [
          `arn:aws:ssm:us-east-1:${this.account}:parameter/${SSM_PARAMETERS_CONFIG.SHARED_PARAMETER_NAME}`,
        ],
      })
    );

    /**
     * Allow to put values to eu-west-1 region
     */
    replicateValuesFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["ssm:PutParameter"],
        resources: [
          `arn:aws:ssm:eu-west-1:${this.account}:parameter/${SSM_PARAMETERS_CONFIG.SHARED_PARAMETER_NAME}`,
        ],
      })
    );

    /**
     * Create Resource Provider for the Custom Resource.
     */
    const provider = new Provider(this, "custom-resource-provider", {
      onEventHandler: replicateValuesFunction,
    });

    /**
     * Create A Custom Resource
     */
    new CustomResource(this, "custom-lambda-resource", {
      serviceToken: provider.serviceToken,
      properties: {
        uniqueId: Math.random(),
      },
    });
  }
}
