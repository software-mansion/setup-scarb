import * as core from "@actions/core";
import * as cache from "@actions/cache";

import { getCacheDirectory, State } from "./cache-utils";

async function saveCache() {
  try {
    const primaryKey = core.getState(State.CachePrimaryKey);
    const matchedKey = core.getState(State.CacheMatchedKey);

    if (primaryKey !== matchedKey) {
      await cache.saveCache([await getCacheDirectory()], primaryKey);
    } else {
      core.info(`Cache hit occurred or no cache found, not saving cache.`);
    }
  } catch (e) {
    core.error(e);
  }
}

saveCache();
