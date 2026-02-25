import { questionsFromTestsRepository } from "../../learn-from-tests/data/QuestionsFromTestsRepository";

/**
 * Repository for "learn from test questions by category" feature.
 * Delegates to questionsFromTestsRepository; keeps this feature's scope isolated.
 */
export const testCategoriesRepository = {
    getCategories: () => questionsFromTestsRepository.getTestCategories(),
    getRandomSetForCategory: (category, numberOfQuestions) =>
        questionsFromTestsRepository.getRandomSetForCategory(category, numberOfQuestions),
};
