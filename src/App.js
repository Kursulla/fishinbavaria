import './App.css';
import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import LearnCategory from "./learn_category/LearnCategory";
import LearnTests from "./learn_tests/LearnTests";
import Home from "./Home";



function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/categories" element={<LearnCategory />} />
                <Route path="/tests" element={<LearnTests/>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
