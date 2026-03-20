import { apiClient } from "../../../../shared/api/apiClient";

export async function fetchQuestionExplanation(question) {
    return apiClient.post("/api/ai/explain", question);
}
