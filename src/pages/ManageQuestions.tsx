import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ManageQuestions.css";

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
  isRequired: boolean;
}

const ManageQuestions: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  const [editingQuestionData, setEditingQuestionData] = useState<Question | null>(null);
  const [editingOption, setEditingOption] = useState<Option | null>(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get("/api/questions");
      setQuestions(response.data.questions_copy);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const deleteQuestion = async (id: number) => {
    try {
      await axios.delete(`/api/questions/${id}`);
      setQuestions(questions.filter((q) => q.id !== id));
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const updateQuestion = async (question: Question) => {
    try {
      await axios.put(`/api/questions/${question.id}`, question);
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

  return (
    <div className="manage-container">
      <h1 className="manage-title">Manage Questions</h1>
      <ul className="manage-list">
        {questions.map((q) => (
          <li key={q.id} className="manage-item">
            <p>{q.question}</p>
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
                <button type="submit">Save Question</button>
              </form>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageQuestions;
