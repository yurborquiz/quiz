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
        correctAnswers.every(a => userAnswer.includes(a)) &&
        userAnswer.length === correctAnswers.length
      );
    }
    return correctAnswers.includes(userAnswer as string);
  };

  const totalQuestions = questions.length;
  const correctAnswersCount = questions.filter(q => isCorrect(q, answers[q.id] || "")).length;
  const incorrectAnswersCount = totalQuestions - correctAnswersCount;
  const correctPercentage = ((correctAnswersCount / totalQuestions) * 100).toFixed(2);
  const incorrectPercentage = ((incorrectAnswersCount / totalQuestions) * 100).toFixed(2);

  return (
    <div className="results-container">
      <h1 className="results-title">Quiz Results</h1>
      <p className="results-summary">
        Correct: {correctAnswersCount} / {totalQuestions} ({correctPercentage}%) | 
        Incorrect: {incorrectAnswersCount} / {totalQuestions} ({incorrectPercentage}%)
      </p>

      {questions.map(q => {
        const userAnswer = answers[q.id] || "";
        const correct = isCorrect(q, userAnswer);

        return (
          <div key={q.id} className={`results-question ${correct ? "correct" : "incorrect"}`}>
            <p className="results-question-text">{q.question}</p>

            <p className={`results-answer ${correct ? "correct-answer" : "incorrect-answer"}`}>
              <strong>Your answer:</strong>
            </p>
            {Array.isArray(userAnswer) ? (
              userAnswer.map((answer, index) => (
                <p key={index} className={`user-answer ${correct ? "correct-answer" : "incorrect-answer"}`}>
                  {answer}
                </p>
              ))
            ) : (
              <p className={`user-answer ${correct ? "correct-answer" : "incorrect-answer"}`}>
                {userAnswer}
              </p>
            )}

            {!correct && (
              <div className="results-correct-answer">
                <strong>Correct answer:</strong>
                {q.options
                  .filter(option => option.correct)
                  .map(option => (
                    <p key={option.id} className="correct-answer-text">{option.text}</p>
                  ))}
              </div>
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
