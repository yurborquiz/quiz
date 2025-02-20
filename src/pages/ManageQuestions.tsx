import { initializeApp } from "firebase/app";
import { get, getDatabase, ref, remove, set } from "firebase/database";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { firebaseConfig } from "../firebaseConfig";
import { Option } from "../interfaces/IOption";
import { Question } from "../interfaces/IQestion";
import "../styles/ManageQuestions.css";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const ManageQuestions: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  const [editingQuestionData, setEditingQuestionData] = useState<Question | null>(null);
  const [editingOption, setEditingOption] = useState<Option | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

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
        setQuestions(questionsList);
      } else {
        console.log("No questions found in database.");
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const deleteQuestion = async (id: number) => {
    try {
      const questionRef = ref(db, `Questions/${id}`);
      await remove(questionRef);
      setQuestions(questions.filter((q) => q.id !== id));
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const updateQuestion = async (question: Question) => {
    try {
      const questionRef = ref(db, `Questions/${question.id}`);
      await set(questionRef, question);
      setQuestions(questions.map((q) => (q.id === question.id ? question : q)));
      setEditingQuestionId(null);
      setEditingQuestionData(null);
    } catch (error) {
      console.error("Error updating question:", error);
    }
  };

  const handleEdit = (question: Question) => {
    setEditingQuestionId(question.id);
    setEditingQuestionData(question);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (editingQuestionData) {
      setEditingQuestionData({
        ...editingQuestionData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingOption) {
      setEditingOption({
        ...editingOption,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleOptionSave = (optionId: number) => {
    if (editingQuestionData && editingOption) {
      const updatedOptions = editingQuestionData.options.map((option) =>
        option.id === optionId ? { ...option, ...editingOption, id: Number(optionId) } : option
      );
      setEditingQuestionData({ ...editingQuestionData, options: updatedOptions });
      setEditingOption(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingQuestionData) {
      updateQuestion(editingQuestionData);
    }
  };

  const handleDeleteOption = (optionId: number) => {
    if (editingQuestionData) {
      const updatedOptions = editingQuestionData.options.filter((option) => option.id !== optionId);
      setEditingQuestionData({ ...editingQuestionData, options: updatedOptions });
    }
  };

  const handleCancel = () => {
    setEditingQuestionId(null);
    setEditingQuestionData(null);
    setEditingOption(null);
  };

  return (
    <div className="manage-container">
      <div className="button-container">
        <button 
          className="google-style-button" 
          onClick={() => navigate("/quiz")}>
          Back to quiz
        </button>
      </div>
      <h1 className="manage-title">Manage Questions</h1>
      <ol className="manage-list">
        {questions.map((q) => (
          <li key={q.id} className="manage-item">
            <p>{q.id + 1}{". "}{q.question}</p>
            <button onClick={() => deleteQuestion(q.id)}>Delete</button>
            <button onClick={() => handleEdit(q)}>Edit</button>
            {editingQuestionId === q.id && editingQuestionData && (
              <form className="manage-form" onSubmit={handleSubmit}>
                <h2>Edit Question</h2>
                <label>
                  Question:
                  <textarea
                    name="question"
                    value={editingQuestionData.question}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Type:
                  <select
                    name="type"
                    value={editingQuestionData.type}
                    onChange={handleChange}
                  >
                    <option value="RADIO">RADIO</option>
                    <option value="CHECKBOX">CHECKBOX</option>
                  </select>
                </label>
                <label>
                  Is Required:
                  <input
                    type="checkbox"
                    name="isRequired"
                    checked={editingQuestionData.isRequired}
                    onChange={(e) =>
                      setEditingQuestionData({ ...editingQuestionData, isRequired: e.target.checked })
                    }
                  />
                </label>
                <h3>Options:</h3>
                <ul className="manage-options-list">
                  {editingQuestionData.options.map((option) => (
                    <li key={option.id} className="manage-option-item">
                      {editingOption && editingOption.id === option.id ? (
                        <>
                          <input
                            type="text"
                            name="text"
                            value={editingOption.text}
                            onChange={handleOptionChange}
                          />
                          <input
                            type="checkbox"
                            name="correct"
                            checked={editingOption.correct}
                            onChange={(e) =>
                              setEditingOption({ ...editingOption, correct: e.target.checked })
                            }
                          />
                          <button type="button" onClick={() => handleOptionSave(option.id)}>Save</button>
                        </>
                      ) : (
                        <>
                          <p>{option.text}</p>
                          <p>{option.correct ? "Correct" : "Incorrect"}</p>
                          <button type="button" onClick={() => handleDeleteOption(option.id)}>Delete</button>
                          <button type="button" onClick={() => setEditingOption(option)}>Edit</button>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
                <div className="manage-buttons">
                  <button type="submit">Save Question</button>
                  <button type="button" onClick={handleCancel}>Cancel</button>
                </div>
              </form>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default ManageQuestions;
