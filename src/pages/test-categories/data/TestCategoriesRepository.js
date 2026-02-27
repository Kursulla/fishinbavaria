import { questionsFromTestsRepository } from "../../tests/data/QuestionsFromTestsRepository";

/**
 * Repository for "test questions by category" feature.
 * Delegates to questionsFromTestsRepository; keeps this feature's scope isolated.
 */
export const testCategoriesRepository = {
    getCategories: () => questionsFromTestsRepository.getTestCategories(),
    getRandomSetForCategory: (category, numberOfQuestions) =>
        questionsFromTestsRepository.getRandomSetForCategory(category, numberOfQuestions),
};
