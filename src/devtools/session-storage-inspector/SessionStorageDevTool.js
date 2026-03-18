import React, { useState } from "react";
import "./SessionStorageDevTool.css";
import { questionDisplayTtlStorage } from "../../common/data/questionDisplayTtlStorage";

const formatDateTime = (timestamp) => {
    if (!timestamp) {
        return "N/A";
    }

    return new Date(timestamp).toLocaleString();
};

const formatDuration = (milliseconds) => {
    if (milliseconds <= 0) {
        return "Expired";
    }

    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`;
    }

    if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
    }

    return `${seconds}s`;
};

const storageInspectors = [
    {
        id: "question-ttl",
        title: "Answered Questions TTL",
        getEntries: () => questionDisplayTtlStorage.getDebugEntries(),
        clear: () => questionDisplayTtlStorage.clear(),
        emptyState: "No answered questions are currently blocked by TTL.",
    },
];

const SessionStorageDevTool = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [, setRefreshKey] = useState(0);

    const inspectorSnapshots = storageInspectors.map((inspector) => ({
        ...inspector,
        entries: inspector.getEntries(),
    }));

    const handleRefresh = () => {
        setRefreshKey((value) => value + 1);
    };

    const handleClear = (inspector) => {
        inspector.clear();
        handleRefresh();
    };

    return (
        <>
            <button
                type="button"
                className="devtool-toggle-button"
                onClick={() => setIsOpen((value) => !value)}
            >
                Dev Tool
            </button>

            {isOpen && (
                <div className="devtool-overlay" role="dialog" aria-modal="true">
                    <div className="devtool-panel">
                        <div className="devtool-panel-header">
                            <div>
                                <h2>Session Storage Dev Tool</h2>
                                <p>Inspect feature-owned TTL/session entries.</p>
                            </div>
                            <div className="devtool-panel-actions">
                                <button type="button" onClick={handleRefresh}>Refresh</button>
                                <button type="button" onClick={() => setIsOpen(false)}>Close</button>
                            </div>
                        </div>

                        {inspectorSnapshots.map((inspector) => (
                            <section key={inspector.id} className="devtool-section">
                                <div className="devtool-section-header">
                                    <h3>{inspector.title}</h3>
                                    <button type="button" onClick={() => handleClear(inspector)}>
                                        Clear
                                    </button>
                                </div>

                                {inspector.entries.length === 0 ? (
                                    <p className="devtool-empty-state">{inspector.emptyState}</p>
                                ) : (
                                    <div className="devtool-table-wrapper">
                                        <table className="devtool-table">
                                            <thead>
                                                <tr>
                                                    <th>Key</th>
                                                    <th>Stored At</th>
                                                    <th>Expires At</th>
                                                    <th>TTL Left</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {inspector.entries.map((entry) => (
                                                    <tr key={entry.key}>
                                                        <td>{entry.key}</td>
                                                        <td>{formatDateTime(entry.storedAt)}</td>
                                                        <td>{formatDateTime(entry.expiresAt)}</td>
                                                        <td>{formatDuration(entry.ttlLeftInMs)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </section>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default SessionStorageDevTool;
