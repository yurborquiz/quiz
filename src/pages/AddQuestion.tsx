import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AddQuestion.css";

export interface Question {
  id: number;
  type: "open" | "yes-no" | "multiple";
  question: string;
  options?: string[];
  answer: string | string[];
}

const AddQuestion: React.FC = () => {
  const [type, setType] = useState<"yes-no" | "multiple">("yes-no");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleCorrectAnswerChange = (option: string, isChecked: boolean) => {
    setCorrectAnswers((prev) =>
      isChecked ? [...prev, option] : prev.filter((ans) => ans !== option)
    );
  };

  const handleSubmit = () => {
    if (!question) {
      alert("Question text cannot be empty!");
      return;
    }

    if (type === "multiple" && options.length === 0) {
      alert("You must add at least one option for multiple-choice questions!");
      return;
    }

    if (type === "multiple" && correctAnswers.length === 0) {
      alert("You must select at least one correct answer!");
      return;
    }

    const newQuestion: Question = {
      id: Date.now(), // Unique ID
      type,
      question,
      options: type === "multiple" ? options : undefined,
      answer: type === "yes-no" ? (correctAnswers[0] || "No") : correctAnswers,
    };

    // Save to the questions list (can be a state or backend API)
    fetch("http://localhost:5000/api/add-question", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newQuestion),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add the question");
        }
        return response.json();
      })
      .then((data) => {
        alert(data.message); // Notify user of success
        navigate("/"); // Redirect to the main page
      })
      .catch((error) => {
        console.error("Error adding question:", error);
        alert("Failed to add the question. Please try again.");
      });
    

    // Redirect back to quiz page or dashboard
    navigate("/");
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
          onChange={(e) => setType(e.target.value as "yes-no" | "multiple")}
        >
          <option value="yes-no">Yes-No</option>
          <option value="multiple">Multiple Choice</option>
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

      {type === "multiple" && (
        <div className="form-group">
          <label className="form-label">Options:</label>
          {options.map((option, index) => (
            <div key={index} className="option-item">
              <input
                type="text"
                className="form-input"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
              />
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={correctAnswers.includes(option)}
                  onChange={(e) =>
                    handleCorrectAnswerChange(option, e.target.checked)
                  }
                />
                Correct Answer
              </label>
            </div>
          ))}
          <button className="btn" onClick={handleAddOption}>
            Add Option
          </button>
        </div>
      )}

      {type === "yes-no" && (
        <div className="form-group">
          <label className="form-label">Correct Answer:</label>
          <label className="radio-label">
            <input
              type="radio"
              name="correct-answer"
              value="Yes"
              checked={correctAnswers.includes("Yes")}
              onChange={() => setCorrectAnswers(["Yes"])}
            />
            Yes
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="correct-answer"
              value="No"
              checked={correctAnswers.includes("No")}
              onChange={() => setCorrectAnswers(["No"])}
            />
            No
          </label>
        </div>
      )}

      <button className="btn submit-btn" onClick={handleSubmit}>
        Save Question
      </button>
    </div>
  );
};

export default AddQuestion;
