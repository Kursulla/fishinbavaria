import { useState } from "react";
import { fetchQuestionExplanation } from "./openRouterQuestionExplanationClient";
import { questionExplanationCacheStorage } from "./questionExplanationCacheStorage";
import {
    trackAiExplanationFailed,
    trackAiExplanationLoaded,
    trackAiExplanationRequested,
} from "../../../../features/analytics/analyticsEvents";

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
            trackAiExplanationRequested({
                questionNumber: question.number,
                questionCategory: question.category,
                source: "cache",
            });
            trackAiExplanationLoaded({
                questionNumber: question.number,
                questionCategory: question.category,
                source: "cache",
            });
            setData(cachedExplanation);
            return;
        }

        trackAiExplanationRequested({
            questionNumber: question.number,
            questionCategory: question.category,
            source: "api",
        });
        setIsLoading(true);

        try {
            const explanation = await fetchQuestionExplanation(question);
            questionExplanationCacheStorage.set(question.number, explanation);
            setData(explanation);
            trackAiExplanationLoaded({
                questionNumber: question.number,
                questionCategory: question.category,
                source: "api",
            });
        } catch (fetchError) {
            trackAiExplanationFailed({
                questionNumber: question.number,
                questionCategory: question.category,
            });
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
