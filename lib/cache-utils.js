import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as glob from "@actions/glob";

import os from "os";
import path from "path";
import fs from "fs/promises";

export const State = {
  CachePrimaryKey: "primary_key",
  CacheMatchedKey: "matched_key",
};

export async function getCacheDirectory() {
  // NOTE: The `cache path` command was introduced in Scarb 0.7.0. We do not want to break compatibility with older
  //   versions yet, so we fall back to a well-known cache path if this command is not available.
  try {
    if (await isScarbMissingCachePathCommand()) {
      return wellKnownCachePath();
    }
  } catch (e) {
    core.debug(`scarb cache path fallback failed: ${e.message}`);
  }

  const { stdout, exitCode } = await exec.getExecOutput("scarb cache path");

  if (exitCode > 0) {
    throw new Error(
      "failed to find cache path: command `scarb cache path` failed",
    );
  }

  return stdout.trim();
}

async function isScarbMissingCachePathCommand() {
  const { stdout } = await exec.getExecOutput("scarb -V");
  return stdout.match(/^scarb 0\.[0-6]\./) != null;
}

function wellKnownCachePath() {
  const platform = os.platform();
  const home = process.env.HOME;

  switch (platform) {
    case "linux":
      return path.join(home, ".cache/scarb");
    case "darwin":
      return path.join(home, `Library/Caches/com.swmansion.scarb`);
    case "win32":
      return path.join(process.env.APPDATA, "swmansion/scarb/config");
    default:
      throw new Error(`caching is not available on this platform: ${platform}`);
  }
}

export async function getCacheKey(scarbLockPath) {
  const platform = process.env.RUNNER_OS;
  const fileHash = await glob.hashFiles(await getScarbLockPath(scarbLockPath));

  if (!fileHash) {
    throw new Error(
      "failed to cache dependencies: unable to hash Scarb.lock file",
    );
  }

  return `scarb-cache-${platform}-${fileHash}`.toLowerCase();
}

async function getScarbLockPath(scarbLockPath = "Scarb.lock") {
  await fs.access(scarbLockPath).catch(() => {
    throw new Error("Failed to find Scarb.lock");
  });
  
  return scarbLockPath;
}
