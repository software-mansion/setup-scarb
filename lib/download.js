import path from "path";
import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import { getOsTriplet } from "./platform";

export async function downloadScarb(repo, version) {
  const triplet = getOsTriplet();
  const basename = `scarb-v${version}-${triplet}`;
  const extension = triplet.includes("-windows-") ? "zip" : "tar.gz";
  const url = `https://github.com/${repo}/releases/download/v${version}/${basename}.${extension}`;

  const pathToTarball = await tc.downloadTool(url);

  const extract = url.endsWith(".zip") ? tc.extractZip : tc.extractTar;
  const extractedPath = await extract(pathToTarball);
  const pathToCli = path.join(extractedPath, basename);

  core.debug(`Extracted to ${pathToCli}`);
  return pathToCli;
}
