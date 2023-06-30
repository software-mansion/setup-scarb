import os from "os";

export function getOsTriplet() {
  const arch = getOsArch();
  const platform = getOsPlatform();
  return `${arch}-${platform}`;
}

export function getOsArch() {
  const arch = os.arch();
  switch (arch) {
    case "arm64":
      return "aarch64";
    case "x64":
      return "x86_64";
    default:
      throw new Error(`unsupported host architecture: ${arch}`);
  }
}

export function getOsPlatform() {
  const platform = os.platform();
  switch (platform) {
    case "linux":
      return "unknown-linux-gnu";
    case "darwin":
      return "apple-darwin";
    case "win32":
      return "pc-windows-msvc";
    default:
      throw new Error(`unsupported host platform: ${platform}`);
  }
}
