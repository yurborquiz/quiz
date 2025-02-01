import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/ResultsPage.css";

interface Option {
  id: number;
  text: string;
  correct: boolean;
}

interface Question {
  id: number;
  type: "RADIO" | "CHECKBOX";
  question: string;
  options: Option[];
}

const ResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { questions, answers } = location.state as {
    questions: Question[];
    answers: { [key: number]: string | string[] };
  };

  const isCorrect = (q: Question, userAnswer: string | string[]): boolean => {
    const correctAnswers = q.options.filter(option => option.correct).map(option => option.text);
    if (Array.isArray(userAnswer)) {
      return (
        Array.isArray(userAnswer) &&
        correctAnswers.every((a) => userAnswer.includes(a)) &&
        userAnswer.length === correctAnswers.length
      );
    }
    return correctAnswers.includes(userAnswer as string);
  };

  const totalQuestions = questions.length;
  const correctAnswersCount = questions.filter((q) =>
    isCorrect(q, answers[q.id] || "")
  ).length;
  const incorrectAnswersCount = totalQuestions - correctAnswersCount;

  const correctPercentage = ((correctAnswersCount / totalQuestions) * 100).toFixed(2);
  const incorrectPercentage = ((incorrectAnswersCount / totalQuestions) * 100).toFixed(2);

  return (
    <div className="results-container">
      <h1 className="results-title">Quiz Results</h1>
      <p className="results-summary">
        Correct: {correctPercentage}% | Incorrect: {incorrectPercentage}%
      </p>
      {questions.map((q) => {
        const userAnswer = answers[q.id] || "";
        const correct = isCorrect(q, userAnswer);

        return (
          <div
            key={q.id}
            className={`results-question ${correct ? "correct" : "incorrect"}`}
          >
            <p className="results-question-text">{q.question}</p>
            <p className="results-answer">
              <strong>Your answer:</strong>{" "}
              <span>{Array.isArray(userAnswer) ? userAnswer.join(", ") : userAnswer}</span>
            </p>
            {!correct && (
              <p className="results-correct-answer">
                <strong>Correct answer:</strong>{" "}
                <span>
                  {q.options.filter(option => option.correct).map(option => option.text).join(", ")}
                </span>
              </p>
            )}
          </div>
        );
      })}
      <button className="results-back" onClick={() => navigate("/")}>
        Back to Quiz
      </button>
    </div>
  );
};

export default ResultsPage;
