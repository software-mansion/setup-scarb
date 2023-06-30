import path from "path";
import * as core from "@actions/core";
import { determineVersion } from "./versions";
import { downloadScarb } from "./download";

const REPO = "software-mansion/scarb";

export default async function main() {
  try {
    const scarbVersionInput = core.getInput("scarb-version");
    const scarbVersion = await determineVersion(REPO, scarbVersionInput);
    core.info(`Setting up Scarb v${scarbVersion}`);
    core.setOutput("scarb-version", scarbVersion);

    const download = await downloadScarb(REPO, scarbVersion);

    core.addPath(path.join(download, "bin"));
  } catch (e) {
    core.setFailed(e);
  }
}
