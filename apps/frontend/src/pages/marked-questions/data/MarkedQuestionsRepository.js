const LOCAL_STORAGE_KEY = "LETS_GO_FISHING"

function fetchDataFromStorage() {
    const storedValue = localStorage.getItem(LOCAL_STORAGE_KEY)
    return storedValue ? new Set(JSON.parse(storedValue)) : new Set();
}

function updateStorageWith(setObject){
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([...setObject]));
}

function addToSet(valueToStore) {
    const currentSet = fetchDataFromStorage()
    currentSet.add(valueToStore);
    updateStorageWith(currentSet)
}

function removeFromSet(value) {
    const currentSet = fetchDataFromStorage()
    let done = false;
    for (const item of currentSet) {
        if (item.number === value.number) {
            currentSet.delete(item);
            done = true
            break;
        }
    }
    if(!done){
        console.log("Unable to delete question from a list of marked questions!!!")
    }else{
        updateStorageWith(currentSet)
    }
}


/**
 * Saves question to a storage
 *
 * @param question
 */
function saveQuestion(question) {
    addToSet(question);
}

/**
 * Deletes question from a storage
 *
 * @param question
 */
function deleteQuestion(question) {
    removeFromSet(question)
}

/**
 * Fetch all questions from a storage
 *
 * @return {Set<unknown>}
 */
function fetchQuestionsAsSet() {
    const stored = fetchDataFromStorage();
    return stored ? stored : new Set();
}

/**
 * Fetch all marked questions as an array (for listing on the page).
 * @return {unknown[]}
 */
function getMarkedQuestions() {
    return Array.from(fetchQuestionsAsSet());
}

/**
 * Use it to purge all saved questions from a storage.
 * Use it wisely, it is irreversible action!!!
 */
function purgeSavedQuestions(){
    localStorage.removeItem(LOCAL_STORAGE_KEY)
}

export const markedQuestionsRepository = {
    saveQuestion,
    deleteQuestion,
    fetchQuestionsAsSet,
    getMarkedQuestions,
    purgeSavedQuestions,
};
