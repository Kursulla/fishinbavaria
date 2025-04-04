import {storageManager} from "../common/data/SavedQuestionsManager";


/**
 * Fetches a certain number of questions from a storage.
 *
 * @return {*[]}
 */
const fetch = function () {
    return Array.from(storageManager.fetchQuestionsAsSet());
}

export const questionsService = {
    fetch
}