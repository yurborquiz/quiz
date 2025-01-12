import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/ResultsPage.css";

interface Question {
  id: number;
  type: "open" | "yesno" | "multiple";
  question: string;
  options?: string[];
  answer: string | string[];
}

const ResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { questions, answers } = location.state as {
    questions: Question[];
    answers: { [key: number]: string | string[] };
  };

  const isCorrect = (q: Question, userAnswer: string | string[]): boolean => {
    if (Array.isArray(q.answer)) {
      return (
        Array.isArray(userAnswer) &&
        q.answer.every((a) => userAnswer.includes(a)) &&
        userAnswer.length === q.answer.length
      );
    }
    return q.answer === userAnswer;
  };

  return (
    <div className="results-container">
      <h1 className="results-title">Quiz Results</h1>
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
                  {Array.isArray(q.answer) ? q.answer.join(", ") : q.answer}
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
