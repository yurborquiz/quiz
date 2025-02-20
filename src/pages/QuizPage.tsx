import { initializeApp } from "firebase/app";
import { get, getDatabase, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { firebaseConfig } from "../firebaseConfig";
import { Option } from "../interfaces/IOption";
import { Question } from "../interfaces/IQestion";
import "../styles/QuizPage.css";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const QuizPage: React.FC = () => {
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: string | string[] }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questionsRef = ref(db, "Questions");
        const snapshot = await get(questionsRef);
        if (snapshot.exists()) {
          const questionsData = snapshot.val();
          const questionsList = Object.keys(questionsData).map((key) => ({
            ...questionsData[key],
            id: Number(key),
          }));
          const shuffledQuestions = questionsList.sort(() => 0.5 - Math.random());
          const uniqueQuestions = new Set<Question>();
          shuffledQuestions.forEach(q => uniqueQuestions.add(q));
          setSelectedQuestions(Array.from(uniqueQuestions).slice(0, 80)); // Get up to 80 unique questions
        } else {
          console.log("No questions found in database.");
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswerChange = (id: number, value: string | string[]): void => {
    setAnswers({ ...answers, [id]: value });
  };

  const handleSubmit = (): void => {
    navigate("/results", { state: { questions: selectedQuestions, answers } });
  };

  return (
    <div className="quiz-container">
      <div className="button-container">
        <button 
          className="google-style-button" 
          onClick={() => navigate("/add")}>
          Add Question
        </button>
        <button 
          className="google-style-button" 
          onClick={() => navigate("/manage")}>
          Manage Questions
        </button>
      </div>
      <h1 className="quiz-title">Quiz</h1>
      {selectedQuestions.map((q, index) => (
        <div key={q.id} className="quiz-question">
          <p className="quiz-question-text">{(index + 1) + ". " + q.question}</p>
          {q.type === "RADIO" && q.options && (
            <fieldset className="quiz-fieldset">
              <legend className="quiz-legend">Choose one answer:</legend>
              {q.options.map((option) => (
                <label key={option.id} className="quiz-label">
                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    value={option.text}
                    onChange={() => handleAnswerChange(q.id, option.text)}
                  />
                  {option.text}
                </label>
              ))}
            </fieldset>
          )}
          {q.type === "CHECKBOX" && q.options && (
            <fieldset className="quiz-fieldset">
              <legend className="quiz-legend">Select all that apply:</legend>
              {q.options.map((option: Option) => (
                <label key={option.id} className="quiz-label">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      const existingAnswers = (answers[q.id] as string[]) || [];
                      const updatedAnswers = e.target.checked
                        ? [...existingAnswers, option.text]
                        : existingAnswers.filter((ans) => ans !== option.text);
                      handleAnswerChange(q.id, updatedAnswers);
                    }}
                  />
                  {option.text}
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
