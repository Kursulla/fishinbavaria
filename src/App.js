import './App.css';
import {generateSetOfQuestionsForCategory} from "./questionsService";
import QuestionComponent from "./QuestionComponent";
import React, {useEffect, useState} from "react";
import {v4 as uuidv4} from "uuid";

function App() {
    const [numberOfQuestions, setSelectedNumberOfQuestions] = useState(20);
    const [questions, setQuestions] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("Fischkunde");
    const categories = ["Fischkunde", "Gewässerkunde", "Schutz und Pflege", "Fanggeräte", "Rechtsvorschriften"];

    useEffect(() => {
        if (questions.length === 0) {
            refreshQuestions(selectedCategory, numberOfQuestions);
        }
    })

    function refreshQuestions(selectedCategory, numberOfQuestions) {
        setQuestions(generateSetOfQuestionsForCategory(selectedCategory, numberOfQuestions))
    }

    const handleCategorySelection = (event) => {
        setSelectedCategory(event.target.value);
        refreshQuestions(event.target.value, numberOfQuestions);
    };

    const handleNumberOfQuestionsChange = (event) => {
        setSelectedNumberOfQuestions(Number(event.target.value));
        refreshQuestions(selectedCategory, Number(event.target.value));
    };

    return (
        <div className="App">
            <div className="categories_container">
                <h3>Koju kategoriju zelis da vezbas:</h3>
                <select className="drop_down" value={selectedCategory} onChange={handleCategorySelection}>
                    <option key={categories[0]} value={categories[0]}>{categories[0]}</option>
                    <option key={categories[1]} value={categories[1]}>{categories[1]}</option>
                    <option key={categories[2]} value={categories[2]}>{categories[2]}</option>
                    <option key={categories[3]} value={categories[3]}>{categories[3]}</option>
                    <option key={categories[4]} value={categories[4]}>{categories[4]}</option>
                </select>
            </div>
            <div className="number_of_questions_container">
                <h3>Koliko pitanja zelis da vidis:</h3>
                <select className="drop_down" value={numberOfQuestions} onChange={handleNumberOfQuestionsChange} autoFocus={false}>
                    <option key="10" value="10">10</option>
                    <option key="20" value="20">20</option>
                    <option key="30" value="30">30</option>
                    <option key="40" value="40">40</option>
                    <option key="50" value="50">50</option>
                </select>
            </div>
            <div className="p-6">
                {selectedCategory && questions && questions.map((question, index) => (
                    <div>
                        <QuestionComponent key={uuidv4()} index = {index} question={question}/>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
