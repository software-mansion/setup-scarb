import path from "path";
import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import { determineVersion } from "./versions";
import { downloadScarb } from "./download";
import { getOsTriplet } from "./platform";

const REPO = "software-mansion/scarb";

export default async function main() {
  try {
    const scarbVersionInput = core.getInput("scarb-version");
    const scarbVersion = await determineVersion(REPO, scarbVersionInput);

    const triplet = getOsTriplet();

    await core.group(`Setting up Scarb v${scarbVersion}`, async () => {
      let installPath = tc.find("scarb", scarbVersion, triplet);
      if (!installPath) {
        const download = await downloadScarb(REPO, scarbVersion);
        installPath = await tc.cacheDir(
          download,
          "scarb",
          scarbVersion,
          triplet,
        );
      }

      core.setOutput("scarb-version", scarbVersion);
      core.addPath(path.join(installPath, "bin"));
    });
  } catch (e) {
    core.setFailed(e);
  }
}
