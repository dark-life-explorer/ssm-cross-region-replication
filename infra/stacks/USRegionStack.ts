import { App, Stack, StackProps } from "aws-cdk-lib";

import { StringParameter, ParameterTier } from "aws-cdk-lib/aws-ssm";

import { SSM_PARAMETERS_CONFIG } from "../consts";

/**
 * Example infrastructure in us-east-1 region
 */
export class USRegionStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    /**
     * Create any resource that is required within the stack in the region.
     */

    /**
     * Put Some Values To The Parameter Store
     */
    new StringParameter(this, "parameter-store-value", {
      parameterName: SSM_PARAMETERS_CONFIG.SHARED_PARAMETER_NAME,
      stringValue: "parameter-store-value",
      description: "Some random parameter value.",
      tier: ParameterTier.STANDARD,
    });
  }
}
