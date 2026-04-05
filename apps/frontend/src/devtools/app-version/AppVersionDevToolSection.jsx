import React from "react";
import { getBuildInfo } from "../../features/app-version/buildInfo";

const buildInfoRows = [
    { label: "Release", valueKey: "releaseVersion" },
    { label: "App Version", valueKey: "appVersion" },
    { label: "Build Number", valueKey: "buildNumber" },
    { label: "Build Source", valueKey: "buildNumberSource" },
    { label: "Branch", valueKey: "gitBranch" },
    { label: "Commit", valueKey: "gitShortSha" },
    { label: "Environment", valueKey: "deploymentEnvironment" },
    { label: "Built At", valueKey: "formattedBuildTimestamp" },
    { label: "Deploy ID", valueKey: "deployId" },
];

const AppVersionDevToolSection = () => {
    const buildInfo = getBuildInfo();

    return (
        <section className="devtool-section">
            <div className="devtool-section-header">
                <div>
                    <h3>App Version</h3>
                    <p className="devtool-section-copy">
                        Release and deployment metadata embedded at build time.
                    </p>
                </div>
            </div>

            <div className="devtool-metadata-list">
                {buildInfoRows.map((row) => (
                    <div key={row.label} className="devtool-metadata-row">
                        <span className="devtool-metadata-label">{row.label}</span>
                        <code className="devtool-metadata-value">{buildInfo[row.valueKey] || "N/A"}</code>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default AppVersionDevToolSection;
