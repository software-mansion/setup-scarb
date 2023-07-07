import * as core from "@actions/core";
import { HttpClient } from "@actions/http-client";

export async function determineVersion(repo, versionInput) {
  versionInput = versionInput.trim();

  if (versionInput === "latest") {
    versionInput = await fetchLatestTag(repo);
  }

  if (versionInput.startsWith("v")) {
    versionInput = versionInput.substring(1);
  }

  if (!versionInput) {
    throw new Error(`'scarb-input' value must not be empty`);
  }

  return versionInput;
}

function fetchLatestTag(repo) {
  // Note: Asking GitHub API for latest release information is the simplest solution here, but has one major drawback:
  // it tends to trigger rate limit errors when run on GitHub actions hosted runners. This method performs requests
  // against GitHub website, which does not rate limit so aggressively. We also never ask for nor download response
  // body, which means that this technique should be theoretically much faster.
  return core.group(
    "Getting information about latest Scarb release from GitHub",
    async () => {
      const http = new HttpClient("software-mansion/setup-scarb", undefined, {
        allowRedirects: false,
      });

      const requestUrl = `https://github.com/${repo}/releases/latest`;
      core.debug(`HEAD ${requestUrl}`);
      const res = await http.head(requestUrl);

      if (res.message.statusCode < 300 || res.message.statusCode >= 400) {
        throw new Error(
          `failed to determine latest version: expected releases request to redirect, instead got http status: ${res.message.statusCode}`,
        );
      }

      const location = res.message.headers.location;
      core.debug(`Location: ${location}`);
      if (!location) {
        throw new Error(
          `failed to determine latest version: releases request response misses 'location' header`,
        );
      }

      const tag = location.replace(/.*\/tag\/(v.*)(?:\/.*)?/, "$1");
      if (!tag) {
        throw new Error(
          `failed to determine latest version: could not extract tag from release url`,
        );
      }

      return tag;
    },
  );
}
