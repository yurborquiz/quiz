import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import questions from "../data/questions.json";
import "../styles/QuizPage.css";

interface Question {
  id: number;
  type: "open" | "yes-no" | "multiple";
  question: string;
  options?: string[];
  answer: string | string[];
}

const QuizPage: React.FC = () => {
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: string | string[] }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const shuffledQuestions = (questions as Question[]).sort(() => 0.5 - Math.random());
    setSelectedQuestions(shuffledQuestions.slice(0, 40));
  }, []);

  const handleAnswerChange = (id: number, value: string | string[]): void => {
    setAnswers({ ...answers, [id]: value });
  };

  const handleSubmit = (): void => {
    navigate("/results", { state: { questions: selectedQuestions, answers } });
  };

  return (
    <div className="quiz-container">
      <h1 className="quiz-title">Quiz</h1>
      {selectedQuestions.map((q) => (
        <div key={q.id} className="quiz-question">
          <p className="quiz-question-text">{q.question}</p>
          {q.type === "open" && (
            <input
              type="text"
              className="quiz-input"
              onChange={(e) => handleAnswerChange(q.id, e.target.value)}
            />
          )}
          {q.type === "yes-no" && (
            <fieldset className="quiz-fieldset">
              <legend className="quiz-legend">Choose an answer:</legend>
              <label className="quiz-label">
                <input
                  type="radio"
                  name={`q-${q.id}`}
                  value="yes"
                  onChange={() => handleAnswerChange(q.id, "yes")}
                />
                Yes
              </label>
              <label className="quiz-label">
                <input
                  type="radio"
                  name={`q-${q.id}`}
                  value="no"
                  onChange={() => handleAnswerChange(q.id, "no")}
                />
                No
              </label>
            </fieldset>
          )}
          {q.type === "multiple" && q.options && (
            <fieldset className="quiz-fieldset">
              <legend className="quiz-legend">Select all that apply:</legend>
              {q.options.map((option: string) => (
                <label key={option} className="quiz-label">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      const existingAnswers = (answers[q.id] as string[]) || [];
                      const updatedAnswers = e.target.checked
                        ? [...existingAnswers, option]
                        : existingAnswers.filter((ans) => ans !== option);
                      handleAnswerChange(q.id, updatedAnswers);
                    }}
                  />
                  {option}
                </label>
              ))}
            </fieldset>
          )}
        </div>
      ))}
      <button className="quiz-submit" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

export default QuizPage;
