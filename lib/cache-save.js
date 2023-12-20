import * as core from "@actions/core";
import * as cache from "@actions/cache";

import { getCacheDirectory, State } from "./cache-utils";

async function saveCache() {
  try {
    const primaryKey = core.getState(State.CachePrimaryKey);
    const matchedKey = core.getState(State.CacheMatchedKey);

    if (primaryKey !== matchedKey) {
      await cache.saveCache([await getCacheDirectory()], primaryKey);
    } else if (primaryKey === "" && matchedKey === "") {
      // When using action for the first time and the project doesn't have Scarb.lock,
      // `restoreCache()` returns an error during `getCacheKey()` method.
      // As a result, primaryKey and matchedKey (by default) are empty strings,
      // which would satisfy `else` branch, even though no cache would be found.
      core.info(`Cache entry not found, not saving cache.`);
    } else {
      core.info(`Cache hit occurred, not saving cache.`);
    }
  } catch (e) {
    core.error(e);
  }
}

saveCache();
