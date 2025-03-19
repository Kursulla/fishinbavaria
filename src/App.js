import './App.css';
import {generateSetOfQuestionsForCategory} from "./questionsService";
import QuestionComponent from "./QuestionComponent";
import {useState} from "react";
import { v4 as uuidv4 } from "uuid";

function App() {
    const [numberOfQuestions, setSelectedNumberOfQuestions] = useState(20);
    const [questions, setQuestions] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("Fischkunde");

    const categories = ["Fischkunde", "Gewässerkunde", "Schutz und Pflege", "Fanggeräte", "Rechtsvorschriften"];

    function refreshQuestions(selectedCategory, numberOfQuestions) {
        setQuestions(generateSetOfQuestionsForCategory(selectedCategory, numberOfQuestions))
    }

    const handleCategorySelection = (category) => {
        setSelectedCategory(category);
        refreshQuestions(category, numberOfQuestions);
    };

    const handleNumberOfQuestionsChange = (event) => {
        setSelectedNumberOfQuestions(Number(event.target.value));
        refreshQuestions(selectedCategory, Number(event.target.value));
    };

    return (
        <div className="App">
            <div className="categories_container">
                <h3>Koju kategoriju zelis da vezbas:</h3>
                {categories.map((category) => (
                    <label key={category} className="checkbox-label">
                        <input
                            type="radio"
                            value={category}
                            checked={selectedCategory.includes(category)}
                            onChange={() => handleCategorySelection(category)}
                        />
                        {category}
                    </label>
                ))}
            </div>
            <div className="number_of_questions_container">
                <h3>Koliko pitanja zelis da vidis:</h3>
                <select value={numberOfQuestions} onChange={handleNumberOfQuestionsChange}>
                    <option key="10" value="10">10</option>
                    <option key="20" value="20">20</option>
                    <option key="30" value="30">30</option>
                    <option key="40" value="40">40</option>
                    <option key="50" value="50">50</option>
                </select>
            </div>
            <div className="p-6">
                {selectedCategory && questions && questions.map(question => (<QuestionComponent key={uuidv4()} question={question}/>))}
            </div>
        </div>
    );
}

export default App;
