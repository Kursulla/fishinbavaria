const STORAGE_KEY = "QUESTION_DISPLAY_TTL_V1";
const QUESTION_TTL_IN_MS = 6 * 60 * 60 * 1000;

function getStorage() {
    if (typeof window === "undefined" || !window.sessionStorage) {
        return null;
    }

    return window.sessionStorage;
}

function readEntries() {
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

function writeEntries(entries) {
    const storage = getStorage();
    if (!storage) {
        return;
    }

    storage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function pruneExpiredEntries(entries, now = Date.now()) {
    return Object.fromEntries(
        Object.entries(entries).filter(([, shownAt]) => now - shownAt < QUESTION_TTL_IN_MS)
    );
}

function getRecentlyShownQuestionNumbers(now = Date.now()) {
    const activeEntries = pruneExpiredEntries(readEntries(), now);
    writeEntries(activeEntries);
    return new Set(Object.keys(activeEntries));
}

function getDebugEntries(now = Date.now()) {
    const activeEntries = pruneExpiredEntries(readEntries(), now);
    writeEntries(activeEntries);

    return Object.entries(activeEntries)
        .map(([key, storedAt]) => ({
            key,
            storedAt,
            expiresAt: storedAt + QUESTION_TTL_IN_MS,
            ttlLeftInMs: Math.max((storedAt + QUESTION_TTL_IN_MS) - now, 0),
        }))
        .sort((left, right) => left.expiresAt - right.expiresAt);
}

function markQuestionsAsShown(questions, now = Date.now()) {
    if (!Array.isArray(questions) || questions.length === 0) {
        return;
    }

    const nextEntries = pruneExpiredEntries(readEntries(), now);

    questions.forEach((question) => {
        if (question?.number) {
            nextEntries[question.number] = now;
        }
    });

    writeEntries(nextEntries);
}

function clear() {
    const storage = getStorage();
    if (!storage) {
        return;
    }

    storage.removeItem(STORAGE_KEY);
}

export const questionDisplayTtlStorage = {
    clear,
    getDebugEntries,
    getRecentlyShownQuestionNumbers,
    markQuestionsAsShown,
};
