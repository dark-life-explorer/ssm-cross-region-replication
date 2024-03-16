import { SSM } from "@aws-sdk/client-ssm";

import { SSM_PARAMETERS_CONFIG } from "../infra/consts";

/**
 * Define source and destination regions.
 */
const sourceRegion = "us-east-1";
const destinationRegion = "eu-west-1";

/**
 * Set up AWS clients for both source and destination regions.
 */
const ssmSource = new SSM({ region: sourceRegion });
const ssmDestination = new SSM({ region: destinationRegion });

/**
 * The lambda handler is used in custom resource stack in order to copy provide parameter store keys fro one region into another region.
 */
export const handler = async (event: any) => {
  const { ResourceProperties } = event;
  const stage = ResourceProperties.stage || "dev";
  const parameterPaths = Object.values(SSM_PARAMETERS_CONFIG);

  /**
   * Get parameters from the source region.
   */
  for (const parameterName of parameterPaths) {
    const param = await ssmSource.getParameter({
      Name: parameterName,
    });

    const newParameter = param.Parameter;

    /*
     * Put parameters into the destination region.
     */
    if (newParameter) {
      await ssmDestination.putParameter({
        Name: newParameter.Name,
        Value: newParameter.Value,
        Type: newParameter.Type,
        Overwrite: true,
      });
    }
  }

  return {};
};
