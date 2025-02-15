import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AddQuestion.css";
import { get, getDatabase, ref, set } from "firebase/database";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../firebaseConfig"; 
import { Question } from "../interfaces/IQestion";
import { Option } from "../interfaces/IOption";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const AddQuestion: React.FC = () => {
  const [type, setType] = useState<"RADIO" | "CHECKBOX">("RADIO");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<Option[]>([]);
  const [isRequired, setIsRequired] = useState(true);
  const navigate = useNavigate();

  const handleAddOption = () => {
    setOptions([...options, { id: Date.now(), text: "", correct: false }]);
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index].text = value;
    setOptions(updatedOptions);
  };

  const handleCorrectAnswerChange = (optionId: number, isChecked: boolean) => {
    const updatedOptions = options.map((option) =>
      option.id === optionId ? { ...option, correct: isChecked } : option
    );
    setOptions(updatedOptions);
  };

  const handleSubmit = async () => {
    if (!question) {
      alert("Question text cannot be empty!");
      return;
    }

    if (options.length === 0) {
      alert("You must add at least one option for the question!");
      return;
    }

    try {
      // Fetch existing questions from Firebase
      const questionsRef = ref(db, "Questions");
      const snapshot = await get(questionsRef);
      let lastQuestionId = 0;

      // If there are existing questions, find the one with the highest id
      if (snapshot.exists()) {
        const questions = snapshot.val();
        lastQuestionId = Math.max(...Object.keys(questions).map(Number));
      }

      // New question id will be lastQuestionId + 1
      const newQuestionId = lastQuestionId + 1;

      const newQuestion: Question = {
        id: newQuestionId, // Use last question's id + 1
        type,
        question,
        options,
        isRequired,
      };

      // Save new question to Firebase Realtime Database
      const questionRef = ref(db, `Questions/${newQuestionId}`);
      await set(questionRef, newQuestion);
      alert("Question added successfully!");
      navigate("/"); // Redirect to the main page or wherever
    } catch (error) {
      console.error("Error adding question:", error);
      alert("Failed to add the question. Please try again.");
    }
  };

  return (
    <div className="add-question-container">
      <h1 className="add-question-title">Add New Question</h1>

      <div className="form-group">
        <label htmlFor="type" className="form-label">Question Type:</label>
        <select
          id="type"
          className="form-select"
          value={type}
          onChange={(e) => setType(e.target.value as "RADIO" | "CHECKBOX")}
        >
          <option value="RADIO">Radio (Single Answer)</option>
          <option value="CHECKBOX">Checkbox (Multiple Answers)</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="question" className="form-label">Question Text:</label>
        <input
          id="question"
          type="text"
          className="form-input"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
      </div>

      {options.map((option, index) => (
        <div key={option.id} className="form-group">
          <label htmlFor={`option-${option.id}`} className="form-label">
            Option {index + 1}:
          </label>
          <input
            id={`option-${option.id}`}
            type="text"
            className="form-input"
            value={option.text}
            onChange={(e) => handleOptionChange(index, e.target.value)}
          />
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={option.correct}
              onChange={(e) =>
                handleCorrectAnswerChange(option.id, e.target.checked)
              }
            />
            Correct Answer
          </label>
        </div>
      ))}
      <button className="btn" onClick={handleAddOption}>
        Add Option
      </button>

      <div className="form-group">
        <label htmlFor="isRequired" className="form-label">Is this question required?</label>
        <input
          type="checkbox"
          checked={isRequired}
          onChange={() => setIsRequired(!isRequired)}
        />
      </div>

      <button className="btn submit-btn" onClick={handleSubmit}>
        Save Question
      </button>
    </div>
  );
};

export default AddQuestion;