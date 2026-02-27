import React from "react";
import "./AnswerStatsBar.css";

/**
 * Shows wrong answers count and success percentage.
 * @param {number} answered - Total number of answered questions
 * @param {number} wrong - Number of wrong answers
 */
const AnswerStatsBar = ({ answered, wrong }) => {
  if (answered === 0) return null;
  const correct = answered - wrong;
  const percent = Math.round((correct / answered) * 100);

  const isBelowPass = percent < 75;

  return (
    <div className="answer-stats-bar" role="status" aria-live="polite">
      <span className="answer-stats-item">
        Pogrešnih: <strong>{wrong}</strong> od <strong>{answered}</strong> odgovorenih
      </span>
      <span className="answer-stats-sep" aria-hidden>|</span>
      <span className="answer-stats-item">
        Uspešnost: <strong>{percent}%</strong>
      </span>
      {isBelowPass && (
        <span className="answer-stats-item answer-stats-bar--below-pass">
          Verovatno pao test.
        </span>
      )}
    </div>
  );
};

export default AnswerStatsBar;
