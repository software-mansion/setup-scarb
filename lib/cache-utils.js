import * as exec from "@actions/exec";
import * as glob from "@actions/glob";

import os from "os";
import path from "path";

export const State = {
  CachePrimaryKey: "primary_key",
  CacheMatchedKey: "matched_key",
};

export async function getCacheDirectory() {
  const { stdout, exitCode } = await exec.getExecOutput("scarb cache path");

  if (exitCode > 0) {
    throw new Error(
      "failed to find cache path: command `scarb cache path` failed",
    );
  }

  return stdout.trim();
}

export async function getCacheKey() {
  const platform = process.env.RUNNER_OS;
  const fileHash = await glob.hashFiles(await getScarbManifestPath());

  if (!fileHash) {
    throw new Error(
      "failed to cache dependencies: unable to hash Scarb.toml file",
    );
  }

  return `scarb-cache-${platform}-${fileHash}`.toLowerCase();
}

async function getScarbManifestPath() {
  const { stdout, exitCode } = await exec.getExecOutput("scarb manifest-path");

  if (exitCode > 0) {
    throw new Error(
      "failed to find Scarb.toml: command `scarb manifest-path` failed",
    );
  }

  return stdout.trim();
}
