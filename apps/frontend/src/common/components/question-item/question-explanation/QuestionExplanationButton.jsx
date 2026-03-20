import React, { useEffect } from "react";
import { useQuestionExplanation } from "./useQuestionExplanation";
import "./QuestionExplanation.css";
import "../remember-button-component/MarkQuestionButton.css";

const QuestionExplanationButton = ({ question }) => {
    const {
        close,
        data,
        error,
        isLoading,
        isOpen,
        open,
    } = useQuestionExplanation(question);

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                close();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [close, isOpen]);

    return (
        <>
            <button
                type="button"
                className="toggle-button question-explanation-trigger"
                aria-label="Prikazi prevod i objasnjenje pitanja"
                onClick={open}
            >
                ?
            </button>

            {isOpen && (
                <div
                    className="question-explanation-overlay"
                    role="dialog"
                    aria-modal="true"
                    onClick={(event) => {
                        if (event.target === event.currentTarget) {
                            close();
                        }
                    }}
                >
                    <div className="question-explanation-modal">
                        <div className="question-explanation-header">
                            <div>
                                <h3>Prevod i objašnjenje</h3>
                                <p>{question.category} [{question.number}]</p>
                            </div>
                            <button type="button" onClick={close}>Zatvori</button>
                        </div>

                        {isLoading && <p className="question-explanation-loading">Učitavam objašnjenje...</p>}

                        {!isLoading && error && (
                            <p className="question-explanation-error">{error}</p>
                        )}

                        {!isLoading && !error && data && (
                            <div className="question-explanation-content">
                                <section>
                                    <h4>Pitanje</h4>
                                    <p>{question.question}</p>
                                    <ul className="question-explanation-list">
                                        {Object.entries(question.options || {}).map(([key, value]) => (
                                            <li
                                                key={key}
                                                className={key === question.answer ? "question-explanation-correct-option" : ""}
                                            >
                                                <strong>{key}:</strong> {value}
                                            </li>
                                        ))}
                                    </ul>
                                </section>

                                <section>
                                    <h4>Prevod</h4>
                                    <p>{data.translation?.question}</p>
                                    {Array.isArray(data.translation?.options) && data.translation.options.length > 0 && (
                                        <ul className="question-explanation-list">
                                            {data.translation.options.map((item) => (
                                                <li
                                                    key={item.key}
                                                    className={item.key === question.answer ? "question-explanation-correct-option" : ""}
                                                >
                                                    <strong>{item.key}:</strong> {item.text}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </section>

                                <section>
                                    <h4>Zašto je tačan odgovor tačan</h4>
                                    <p>{data.correctAnswerReason}</p>
                                </section>

                                {Array.isArray(data.wrongAnswers) && data.wrongAnswers.length > 0 && (
                                    <section>
                                        <h4>Zašto ostali odgovori nisu tačni</h4>
                                        <ul className="question-explanation-list">
                                            {data.wrongAnswers.map((item) => (
                                                <li key={item.key}>
                                                    <strong>{item.key}:</strong> {item.reason}
                                                </li>
                                            ))}
                                        </ul>
                                    </section>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default QuestionExplanationButton;
