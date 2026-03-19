import React, { useState } from "react";
import { openRouterModelDevSettingsStorage } from "./openRouterModelDevSettingsStorage";

const OpenRouterModelDevToolSection = () => {
    const [settings, setSettings] = useState(() => openRouterModelDevSettingsStorage.getSettings());

    const persist = (nextSettings) => {
        setSettings(nextSettings);
        openRouterModelDevSettingsStorage.saveSettings(nextSettings);
    };

    const reset = () => {
        openRouterModelDevSettingsStorage.clear();
        setSettings(openRouterModelDevSettingsStorage.getSettings());
    };

    return (
        <section className="devtool-section">
            <div className="devtool-section-header">
                <div>
                    <h3>OpenRouter Models</h3>
                    <p className="devtool-section-copy">
                        Choose the active model and edit its display metadata.
                    </p>
                </div>
                <div className="devtool-inline-actions">
                    <button type="button" onClick={reset}>Reset</button>
                </div>
            </div>

            <div className="devtool-model-selector">
                <select
                    value={settings.activeModelId}
                    onChange={(event) => persist({ ...settings, activeModelId: event.target.value })}
                >
                    {settings.models.map((model) => (
                        <option key={model.id} value={model.id}>
                            {model.price ? `${model.label} | ${model.price}` : model.label}
                        </option>
                    ))}
                </select>
            </div>
        </section>
    );
};

export default OpenRouterModelDevToolSection;
