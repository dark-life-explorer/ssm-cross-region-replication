import { App } from "aws-cdk-lib";

import { EURegionStack } from "./stacks/EURegionStack";
import { USRegionStack } from "./stacks/USRegionStack";
import { SSMReplicationStack } from "./stacks/SSMReplicationStack";

import { GENERAL_CONFIG } from "./consts";

/**
 * Define env variables via console or ci/cd pipeline.
 *
 * @param account - unique identifier of your AWS account.
 */
const account = process.env.ACCOUNT || "";

const app = new App();

const usStack = new USRegionStack(
  app,
  GENERAL_CONFIG.US_STACK_NAME.replace(/\s+/g, ""),
  {
    env: {
      account,
      region: "us-east-1",
    },
  }
);

const ssmReplicationStack = new SSMReplicationStack(
  app,
  GENERAL_CONFIG.SSM_REPLICATION_STACK_NAME.replace(/\s+/g, ""),
  {
    env: {
      account,
      region: "us-east-1",
    },
  }
);
ssmReplicationStack.addDependency(usStack);

const euStack = new EURegionStack(
  app,
  GENERAL_CONFIG.EU_STACK_NAME.replace(/\s+/g, ""),
  {
    env: {
      account,
      region: "eu-west-1",
    },
  }
);

euStack.addDependency(ssmReplicationStack);
