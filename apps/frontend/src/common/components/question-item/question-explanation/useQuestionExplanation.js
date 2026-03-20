import { useState } from "react";
import { fetchQuestionExplanation } from "./openRouterQuestionExplanationClient";
import { questionExplanationCacheStorage } from "./questionExplanationCacheStorage";

export function useQuestionExplanation(question) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [data, setData] = useState(() => questionExplanationCacheStorage.get(question.number));

    const open = async () => {
        setIsOpen(true);
        setError("");

        const cachedExplanation = questionExplanationCacheStorage.get(question.number);
        if (cachedExplanation) {
            setData(cachedExplanation);
            return;
        }

        setIsLoading(true);

        try {
            const explanation = await fetchQuestionExplanation(question);
            questionExplanationCacheStorage.set(question.number, explanation);
            setData(explanation);
        } catch (fetchError) {
            setError(fetchError.message || "Unable to fetch explanation.");
        } finally {
            setIsLoading(false);
        }
    };

    const close = () => {
        setIsOpen(false);
    };

    return {
        close,
        data,
        error,
        isLoading,
        isOpen,
        open,
    };
}
