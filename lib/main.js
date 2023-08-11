import path from "path";
import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import {
  determineVersion,
  getFullVersionFromScarb,
  versionWithPrefix,
} from "./versions";
import { downloadScarb } from "./download";
import { getOsTriplet } from "./platform";
import { restoreCache } from "./cache-restore";

export default async function main() {
  try {
    const scarbVersionInput = core.getInput("scarb-version");
    const { repo: scarbRepo, version: scarbVersion } = await determineVersion(
      scarbVersionInput,
      {
        repo: "software-mansion/scarb",
        nightliesRepo: "software-mansion/scarb-nightlies",
      },
    );

    const triplet = getOsTriplet();

    await core.group(
      `Setting up Scarb ${versionWithPrefix(scarbVersion)}`,
      async () => {
        let scarbPrefix = tc.find("scarb", scarbVersion, triplet);
        if (!scarbPrefix) {
          const download = await downloadScarb(scarbRepo, scarbVersion);
          scarbPrefix = await tc.cacheDir(
            download,
            "scarb",
            scarbVersion,
            triplet,
          );
        }

        core.setOutput("scarb-prefix", scarbPrefix);
        core.addPath(path.join(scarbPrefix, "bin"));
      },
    );

    core.setOutput("scarb-version", await getFullVersionFromScarb());

    await restoreCache().catch((e) => {
      core.error(
        `There was an error when restoring cache: ${
          e instanceof Error ? e.message : e
        }`,
      );
    });
  } catch (e) {
    core.setFailed(e);
  }
}
