const STORAGE_KEY = "OPENROUTER_MODEL_DEV_SETTINGS_V1";

const DEFAULT_MODELS = [
  {
    id: "mistral-small-2603",
    label: "Mistral Small 2603",
    modelId: "mistralai/mistral-small-2603",
    isDefault: true,
    price: "0.15, 0.6",
    speed: "",
    notes: "Works OK",
  },
  {
    id: "openai/gpt-4o-mini",
    label: "GPT-4o Mini",
    modelId: "openai/gpt-4o-mini",
    isDefault: false,
    price: "0.15, 0.6",
    speed: "",
    notes: "",
  },
  {
    id: "mistralai/mistral-small-3.2-24b-instruct",
    label: "Mistral Small 3.2 24B Instruct",
    modelId: "mistralai/mistral-small-3.2-24b-instruct",
    isDefault: false,
    price: "0.075, 0.2",
    speed: "",
    notes: "",
  },
  {
    id: "anthropic/claude-3.5-haiku",
    label: "Claude 3.5 Haiku",
    modelId: "anthropic/claude-3.5-haiku",
    isDefault: false,
    price: "0.8, 4",
    speed: "",
    notes: "",
  },
];

function getDefaultModel(models = DEFAULT_MODELS) {
    return models.find((model) => model.isDefault) || models[0];
}

const DEFAULT_SETTINGS = {
    activeModelId: getDefaultModel(DEFAULT_MODELS).id,
    models: DEFAULT_MODELS,
};

function getStorage() {
    if (typeof window === "undefined" || !window.localStorage) {
        return null;
    }

    return window.localStorage;
}

function normalizeModels(models) {
    return (Array.isArray(models) ? models : []).map((model, index) => ({
        id: model.id || `custom-model-${index + 1}`,
        label: model.label || "",
        modelId: model.modelId || "",
        isDefault: Boolean(model.isDefault),
        price: model.price || "",
        speed: model.speed || "",
        notes: model.notes || "",
    }));
}

function readSettings() {
    const storage = getStorage();
    if (!storage) {
        return DEFAULT_SETTINGS;
    }

    try {
        const rawValue = storage.getItem(STORAGE_KEY);
        if (!rawValue) {
            return DEFAULT_SETTINGS;
        }

        const parsed = JSON.parse(rawValue);
        const models = normalizeModels(parsed.models);
        const defaultModel = getDefaultModel(models.length > 0 ? models : DEFAULT_MODELS);

        return {
            activeModelId: parsed.activeModelId || defaultModel?.id || DEFAULT_SETTINGS.activeModelId,
            models: models.length > 0 ? models : DEFAULT_MODELS,
        };
    } catch (_error) {
        return DEFAULT_SETTINGS;
    }
}

function writeSettings(settings) {
    const storage = getStorage();
    if (!storage) {
        return;
    }

    storage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

function getSettings() {
    return readSettings();
}

function saveSettings(settings) {
    const normalizedModels = normalizeModels(settings.models);
    const defaultModel = getDefaultModel(normalizedModels);
    const nextSettings = {
        activeModelId: settings.activeModelId || defaultModel?.id || "",
        models: normalizedModels,
    };
    writeSettings(nextSettings);
}

function getActiveModelOverride() {
    const settings = readSettings();
    const activeModel = settings.models.find((model) => model.id === settings.activeModelId);
    return activeModel?.modelId?.trim() || "";
}

function getDefaultModelId() {
    return getDefaultModel(DEFAULT_MODELS).modelId;
}

function clear() {
    const storage = getStorage();
    if (!storage) {
        return;
    }

    storage.removeItem(STORAGE_KEY);
}

export const openRouterModelDevSettingsStorage = {
    clear,
    getActiveModelOverride,
    getDefaultModelId,
    getSettings,
    saveSettings,
    STORAGE_KEY,
};
