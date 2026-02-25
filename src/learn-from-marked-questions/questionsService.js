import {savedQuestionsManager} from "../common/data/SavedQuestionsManager";


/**
 * Fetches a certain number of questions from a storage.
 *
 * @return {*[]}
 */
const fetch = function () {
    return Array.from(savedQuestionsManager.fetchQuestionsAsSet());
}

export const questionsService = {
    fetch
}