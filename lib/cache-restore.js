import * as core from "@actions/core";
import * as cache from "@actions/cache";

import fs from "fs/promises";

import {
  getCacheDirectory,
  getCacheKey,
  State,
  maybeGetScarbTargetDirPath,
} from "./cache-utils";

export async function restoreCache(scarbLockPath, enableTargetsCache, jobName) {
  const cacheDir = await getCacheDirectory();
  await fs.mkdir(cacheDir, { recursive: true });

  core.info(`Restoring Scarb cache into ${cacheDir}`);

  let cacheDirs = [cacheDir];
  if (enableTargetsCache) {
    let targetCache = await maybeGetScarbTargetDirPath(scarbLockPath);
    if (!!targetCache) {
      core.info(`Restoring Scarb target cache into ${targetCache}`);
      cacheDirs.push(targetCache);
    }
  }

  const baseKey = await getCacheKey(scarbLockPath);
  const primaryKey = `${jobName}-${baseKey}`;
  core.info(`Cache primary key is ${primaryKey}`);

  core.saveState(State.CachePrimaryKey, primaryKey);

  const matchedKey = await cache.restoreCache(cacheDirs, primaryKey);
  if (!matchedKey) {
    core.info(`Cache entry not found.`);
    return;
  }

  core.saveState(State.CacheMatchedKey, matchedKey);
}
