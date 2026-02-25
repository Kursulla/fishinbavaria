import React from "react";
import { savedQuestionsManager } from "./common/data/SavedQuestionsManager";

const Home = () => {
  const URLParams = new URLSearchParams(window.location.search);
  const showDeleteButton = URLParams.get("reset");

  function handleCleaningMarketQuestionsClick() {
    savedQuestionsManager.purgeSavedQuestions();
  }

  return (
    <div className="home-content">
      <p className="home-intro">Izaberi način vežbanja u meniju iznad.</p>
      {showDeleteButton && (
        <button
          className="purge_local_storage"
          onClick={handleCleaningMarketQuestionsClick}
        >
          Obriši sva markirana pitanja
        </button>
      )}
    </div>
  );
};

export default Home;