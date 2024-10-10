import * as core from "@actions/core";
import * as cache from "@actions/cache";

import fs from "fs/promises";

import { getCacheDirectory, getCacheKey, State } from "./cache-utils";

export async function restoreCache(scarbLockPath) {
  const cacheDir = await getCacheDirectory();
  await fs.mkdir(cacheDir, { recursive: true });

  core.info(`Restoring Scarb cache into ${cacheDir}`);

  const primaryKey = await getCacheKey(scarbLockPath);
  core.info(`Cache primary key is ${primaryKey}`);
  core.saveState(State.CachePrimaryKey, primaryKey);

  const matchedKey = await cache.restoreCache([cacheDir], primaryKey);
  if (!matchedKey) {
    core.info(`Cache entry not found.`);
    return;
  }

  core.saveState(State.CacheMatchedKey, matchedKey);
}
