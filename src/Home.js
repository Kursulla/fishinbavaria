import React from "react";
import {useNavigate} from "react-router-dom";


const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="App">
            <img className="logo" src="logo192.png" alt="Some alt tag"/>

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
        </div>
    );
};

export default Home;