import React, { useEffect, useState } from "react";
import "./SessionStorageDevTool.css";
import { questionDisplayTtlStorage } from "../../common/data/questionDisplayTtlStorage";
import { questionExplanationCacheStorage } from "../../common/components/question-item/question-explanation/questionExplanationCacheStorage";
import OpenRouterModelDevToolSection from "../open-router-models/OpenRouterModelDevToolSection";

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
        columns: ["Key", "Stored At", "Expires At", "TTL Left"],
        renderRow: (entry) => [
            entry.key,
            formatDateTime(entry.storedAt),
            formatDateTime(entry.expiresAt),
            formatDuration(entry.ttlLeftInMs),
        ],
    },
    {
        id: "question-explanation-cache",
        title: "Question Explanation Cache",
        getEntries: () => questionExplanationCacheStorage.getDebugEntries(),
        clear: () => questionExplanationCacheStorage.clear(),
        emptyState: "No cached question explanations in localStorage.",
        columns: ["Key", "Translated Question", "Wrong Answers", "Has Correct Reason"],
        renderRow: (entry) => [
            entry.key,
            entry.translationQuestion || "N/A",
            String(entry.wrongAnswersCount),
            entry.hasCorrectAnswerReason ? "Yes" : "No",
        ],
    },
];

const SessionStorageDevTool = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [, setRefreshKey] = useState(0);

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

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
                <div
                    className="devtool-overlay"
                    role="dialog"
                    aria-modal="true"
                    onClick={(event) => {
                        if (event.target === event.currentTarget) {
                            setIsOpen(false);
                        }
                    }}
                >
                    <div className="devtool-panel">
                        <div className="devtool-panel-header">
                            <div>
                                <h2>Storage Dev Tool</h2>
                                <p>Inspect feature-owned sessionStorage and localStorage entries.</p>
                            </div>
                            <div className="devtool-panel-actions">
                                <button type="button" onClick={handleRefresh}>Refresh</button>
                                <button type="button" onClick={() => setIsOpen(false)}>Close</button>
                            </div>
                        </div>

                        <OpenRouterModelDevToolSection />

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
                                                    {inspector.columns.map((column) => (
                                                        <th key={column}>{column}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {inspector.entries.map((entry) => (
                                                    <tr key={entry.key}>
                                                        {inspector.renderRow(entry).map((value, index) => (
                                                            <td key={`${entry.key}-${inspector.columns[index]}`}>{value}</td>
                                                        ))}
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
