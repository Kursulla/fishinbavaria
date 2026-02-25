import {markedQuestionsRepository} from "./data/MarkedQuestionsRepository";


/**
 * Fetches a certain number of questions from a storage.
 *
 * @return {*[]}
 */
const fetch = function () {
    return Array.from(markedQuestionsRepository.fetchQuestionsAsSet());
}

export const questionsService = {
    fetch
}