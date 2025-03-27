import React from "react";
import {useNavigate} from "react-router-dom";


const Home = () => {
    const navigate = useNavigate();

    function handleClickOnCategories() {
        navigate('/categories');
    }

    function handleClickOnTests() {
        navigate('/tests');
    }

    return (
        <div className="App">
            <img className="logo" src="logo192.png" alt="Some alt tag"/>

            <ul className="question-options">
                <li
                    className={`cursor_hand option-item`}
                    onClick={() => handleClickOnCategories()}
                >
                    Vezbaj kategorije
                </li>
                <li
                    className={`cursor_hand option-item`}
                    onClick={() => handleClickOnTests()}
                >
                    Vezbaj testove
                </li>
            </ul>
        </div>
    );
};

export default Home;