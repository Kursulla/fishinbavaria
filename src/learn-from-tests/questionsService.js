import fileWithTopQuestions from "./questionsFromTests.json";
import {generationQuestionsUtil} from "../common/data/questionsGenerationUtil";


const generateQuestions = (category, numberOfQuestions) => {
    return generationQuestionsUtil.setOfQuestionsForCategory(category, numberOfQuestions, fileWithTopQuestions)
}

const numberOfQuestions = () => {
    return fileWithTopQuestions.length;
}

export const questionsService = {
    generateFromCategory: generateQuestions,
    totalNumberOfQuestionsFromTests: numberOfQuestions
}

