const STORAGE_KEY = "QUESTION_EXPLANATION_CACHE_V1";

function getStorage() {
    if (typeof window === "undefined" || !window.localStorage) {
        return null;
    }

    return window.localStorage;
}

function readCache() {
    const storage = getStorage();
    if (!storage) {
        return {};
    }

    try {
        const rawValue = storage.getItem(STORAGE_KEY);
        return rawValue ? JSON.parse(rawValue) : {};
    } catch (_error) {
        return {};
    }
}

function writeCache(cache) {
    const storage = getStorage();
    if (!storage) {
        return;
    }

    storage.setItem(STORAGE_KEY, JSON.stringify(cache));
}

function get(questionNumber) {
    const cache = readCache();
    return cache[questionNumber] ?? null;
}

function set(questionNumber, explanation) {
    if (!questionNumber) {
        return;
    }

    const cache = readCache();
    cache[questionNumber] = explanation;
    writeCache(cache);
}

function getDebugEntries() {
    const cache = readCache();

    return Object.entries(cache)
        .map(([key, value]) => ({
            key,
            translationQuestion: value?.translation?.question ?? "",
            wrongAnswersCount: Array.isArray(value?.wrongAnswers) ? value.wrongAnswers.length : 0,
            hasCorrectAnswerReason: Boolean(value?.correctAnswerReason),
        }))
        .sort((left, right) => left.key.localeCompare(right.key));
}

function clear() {
    const storage = getStorage();
    if (!storage) {
        return;
    }

    storage.removeItem(STORAGE_KEY);
}

export const questionExplanationCacheStorage = {
    clear,
    get,
    getDebugEntries,
    set,
    STORAGE_KEY,
};
