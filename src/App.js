import './App.css';
import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import LearnFromCategoryPage from "./learn-from-category/LearnFromCategoryPage";
import LearnFromTests from "./learn-from-tests/LearnFromTests";
import Home from "./Home";
import LearnFromMarked from "./learn-from-marked-questions/LearnFromMarked";



function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/categories" element={<LearnFromCategoryPage />} />
                <Route path="/tests" element={<LearnFromTests/>} />
                <Route path="/marked" element={<LearnFromMarked/>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
