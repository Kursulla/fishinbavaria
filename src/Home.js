import React from "react";
import {useNavigate} from "react-router-dom";
import {savedQuestionsManager} from "./common/data/SavedQuestionsManager";




const Home = () => {
    const navigate = useNavigate();
    const URLParams = new URLSearchParams(window.location.search);
    const showDeleteButton = URLParams.get('reset');

    function handleCleaningMarketQuestionsClick() {
        savedQuestionsManager.purgeSavedQuestions()
    }
    return (
        <div className="App">
            <img className="logo" src="logo_300.png" alt="Some alt tag"/>

            <ul className="question-options">
                <li
                    className={`cursor_hand option-item`}
                    onClick={() => navigate('/categories')}
                >
                    Vezbaj kategorije
                </li>
                <li
                    className={`cursor_hand option-item`}
                    onClick={() => navigate('/tests')}
                >
                    Vezbaj testove
                </li>
                <li
                    className={`cursor_hand option-item`}
                    onClick={() => navigate('/marked')}
                >
                    Vezbaj obelezene
                </li>
            </ul>
            {showDeleteButton && <button className="purge_local_storage" onClick={handleCleaningMarketQuestionsClick}>Obrisi sva markirana pitanja</button>}
        </div>
    );
};

export default Home;