import * as exec from "@actions/exec";
import * as glob from "@actions/glob";

import os from "os";
import path from "path";

export const State = {
  CachePrimaryKey: "primary_key",
  CacheMatchedKey: "matched_key",
};

export function getCacheDirectory() {
  const platform = os.platform();
  const home = process.env.HOME;

  switch (platform) {
    case "linux":
      return path.join(home, ".cache/scarb");
    case "darwin":
      return path.join(home, `Library/Caches/com.swmansion.Scarb`);
    case "win32":
      return path.join(process.env.APPDATA, "swmansion/Scarb/config");
    default:
      throw new Error(`Caching not available for ${platform} platform.`);
  }
}

export async function getCacheKey() {
  const platform = process.env.RUNNER_OS;
  const fileHash = await glob.hashFiles(await getScarbManifestPath());

  if (!fileHash) {
    throw new Error(
      "Unable to hash Scarb.toml file, cannot cache dependencies.",
    );
  }

  return `scarb-cache-${platform}-${fileHash}`.toLowerCase();
}

async function getScarbManifestPath() {
  const { stdout, exitCode } = await exec.getExecOutput("scarb manifest-path");

  if (exitCode > 0) {
    throw new Error("Unable to resolve Scarb.toml path.");
  }

  return stdout.trim();
}
