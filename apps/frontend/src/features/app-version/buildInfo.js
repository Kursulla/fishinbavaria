import { generatedBuildInfo } from "./generatedBuildInfo";

function formatBuildTimestamp(value) {
  if (!value) {
    return "N/A";
  }

  return new Date(value).toLocaleString();
}

export function getBuildInfo() {
  return {
    ...generatedBuildInfo,
    formattedBuildTimestamp: formatBuildTimestamp(generatedBuildInfo.buildTimestamp),
  };
}

export function exposeBuildInfoToWindow() {
  if (typeof window === "undefined") {
    return;
  }

  const buildInfo = getBuildInfo();
  window.__APP_BUILD_INFO__ = buildInfo;
  window.__APP_VERSION__ = buildInfo.releaseVersion;
}
