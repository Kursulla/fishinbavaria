import {storageManager} from "../common/data/SavedQuestionsManager";


/**
 * Fetches a certain number of questions from a storage.
 *
 * @param numberOfQuestions
 * @return {*[]}
 */
const fetch = (numberOfQuestions) => {
    return Array.from(storageManager.fetchQuestionsAsSet());
}

export const questionsService = {
    fetch
}