import { App, Stack, StackProps } from "aws-cdk-lib";

import { StringParameter } from "aws-cdk-lib/aws-ssm";

import { SSM_PARAMETERS_CONFIG } from "../consts";

/**
 * Example infrastructure in eu-west-1 region
 */
export class EURegionStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    /**
     * Create any resource that is required within the stack in the region.
     */

    /**
     * Get a parameter from eu region by it's name.
     */
    const exampleParameterValue = StringParameter.fromStringParameterName(
      this,
      "parameter-store-value",
      SSM_PARAMETERS_CONFIG.SHARED_PARAMETER_NAME
    ).stringValue;

    /**
     * Use the fetched value ...
     */
  }
}
