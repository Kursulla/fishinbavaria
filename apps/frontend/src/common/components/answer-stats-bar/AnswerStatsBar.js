import React from "react";
import "./AnswerStatsBar.css";

/**
 * Shows overall answer stats and optional per-category breakdown.
 * @param {number} answered - Total number of answered questions
 * @param {number} wrong - Number of wrong answers
 * @param {Array<{ category: string, answered: number, wrong: number }>} categoryStats
 */
const AnswerStatsBar = ({ answered, wrong, categoryStats = [] }) => {
  const correct = answered - wrong;
  const percent = answered > 0 ? Math.round((correct / answered) * 100) : 0;

  const isBelowPass = answered > 0 && percent < 75;

  return (
    <section className="answer-stats-shell" role="status" aria-live="polite">
      <div className="answer-stats-bar">
        <span className="answer-stats-item">
          Tačnih: <strong>{correct}</strong> od <strong>{answered}</strong> odgovorenih
        </span>
        <span className="answer-stats-sep" aria-hidden>|</span>
        <span className="answer-stats-item">
          Pogrešnih: <strong>{wrong}</strong>
        </span>
        <span className="answer-stats-sep" aria-hidden>|</span>
        <span className="answer-stats-item">
          Uspešnost: <strong>{percent}%</strong>
        </span>
        {isBelowPass && (
          <span className="answer-stats-item answer-stats-bar--below-pass">
            Pali ste!
          </span>
        )}
      </div>
      {categoryStats.length > 0 && (
        <div className="answer-stats-categories" aria-label="Statistika po kategorijama">
          {categoryStats.map(({ category, answered: categoryAnswered, wrong: categoryWrong }) => {
            const categoryCorrect = categoryAnswered - categoryWrong;
            const categoryPercent =
              categoryAnswered > 0 ? Math.round((categoryCorrect / categoryAnswered) * 100) : 0;

            return (
              <div key={category} className="answer-stats-category-card">
                <span className="answer-stats-category-title">{category}</span>
                <span className="answer-stats-category-value">
                  Tačnih <strong>{categoryCorrect}</strong>/<strong>{categoryAnswered}</strong>
                </span>
                <span className="answer-stats-category-value">
                  Uspešnost <strong>{categoryPercent}%</strong>
                </span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default AnswerStatsBar;
