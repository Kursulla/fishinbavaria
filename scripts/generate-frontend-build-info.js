const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const repoRoot = path.resolve(__dirname, "..");
const frontendRoot = path.join(repoRoot, "apps", "frontend");
const frontendPackageJsonPath = path.join(frontendRoot, "package.json");
const outputPath = path.join(
  frontendRoot,
  "src",
  "features",
  "app-version",
  "generatedBuildInfo.js"
);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function runGitCommand(args) {
  try {
    return execSync(`git ${args}`, {
      cwd: repoRoot,
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
  } catch (error) {
    return "";
  }
}

function resolveBuildNumber() {
  const envBuildNumber =
    process.env.APP_BUILD_NUMBER ||
    process.env.BUILD_NUMBER ||
    process.env.GITHUB_RUN_NUMBER ||
    process.env.CI_PIPELINE_IID ||
    process.env.CI_PIPELINE_ID;

  if (envBuildNumber) {
    return {
      value: String(envBuildNumber),
      source: "env",
    };
  }

  const gitCommitCount = runGitCommand("rev-list --count HEAD");

  if (gitCommitCount) {
    return {
      value: gitCommitCount,
      source: "git-commit-count",
    };
  }

  return {
    value: new Date().toISOString().replace(/\D/g, "").slice(0, 14),
    source: "timestamp",
  };
}

function resolveDeployId() {
  return (
    process.env.DEPLOYMENT_ID ||
    process.env.VERCEL_DEPLOYMENT_ID ||
    process.env.RAILWAY_DEPLOYMENT_ID ||
    process.env.RENDER_GIT_COMMIT ||
    ""
  );
}

function generateBuildInfo() {
  const frontendPackageJson = readJson(frontendPackageJsonPath);
  const buildNumber = resolveBuildNumber();
  const gitSha =
    process.env.VERCEL_GIT_COMMIT_SHA ||
    process.env.GITHUB_SHA ||
    process.env.CI_COMMIT_SHA ||
    runGitCommand("rev-parse HEAD");
  const gitShortSha = gitSha ? gitSha.slice(0, 7) : "";
  const gitBranch =
    process.env.VERCEL_GIT_COMMIT_REF ||
    process.env.GITHUB_REF_NAME ||
    process.env.CI_COMMIT_REF_NAME ||
    runGitCommand("rev-parse --abbrev-ref HEAD");
  const buildTimestamp = new Date().toISOString();
  const deploymentEnvironment =
    process.env.VERCEL_ENV ||
    process.env.NODE_ENV ||
    process.env.APP_ENV ||
    "development";
  const deployId = resolveDeployId();
  const appVersion =
    process.env.APP_VERSION ||
    process.env.npm_package_version ||
    frontendPackageJson.version;
  const releaseVersion = `${appVersion}+${buildNumber.value}`;

  const fileContent = `export const generatedBuildInfo = ${JSON.stringify(
    {
      appVersion,
      buildNumber: buildNumber.value,
      buildNumberSource: buildNumber.source,
      releaseVersion,
      gitSha,
      gitShortSha,
      gitBranch,
      buildTimestamp,
      deploymentEnvironment,
      deployId,
    },
    null,
    2
  )};
`;

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, fileContent, "utf8");
  process.stdout.write(`Generated ${path.relative(repoRoot, outputPath)}\n`);
}

generateBuildInfo();
