import * as core from "@actions/core";
import * as io from "@actions/io";

import fs from "fs";
import path from "path";

export async function cleanTargetDir(targetDir) {
  core.info(`cleaning target directory "${targetDir}"`);

  // remove all *files* from the target directory, except for `CACHEDIR.TAG`
  // remove `scarb doc` and `scarb package` output directories
  let dir = await fs.promises.opendir(targetDir);
  for await (const dirent of dir) {
    if (dirent.isDirectory()) {
      let dirName = path.join(dir.path, dirent.name);
      try {
        if (dirent.name in ["doc", "package", "execute"]) {
          // There is no point to cache directories created by `scarb doc`, `scarb package` or `scarb execute`.
          await rm(dir.path, dirent);
          continue;
        }
        await cleanProfileTarget(dirName);
      } catch {}
    } else if (dirent.name !== "CACHEDIR.TAG") {
      await rm(dir.path, dirent);
    }
  }
}

async function cleanProfileTarget(profileDir) {
  core.debug(`cleaning profile directory "${profileDir}"`);

  // remove all files, but keep all directories
  let dir = await fs.promises.opendir(profileDir);
  for await (const dirent of dir) {
    if (!dirent.isDirectory()) {
      await rm(dir.path, dirent);
    }
  }
}

async function rm(parent, dirent) {
  try {
    const fileName = path.join(parent, dirent.name);
    core.debug(`deleting "${fileName}"`);
    if (dirent.isFile()) {
      await fs.promises.unlink(fileName);
    } else if (dirent.isDirectory()) {
      await io.rmRF(fileName);
    }
  } catch {}
}
