import React from "react";
import { getDatabase, ref, set } from "firebase/database";
import { app } from "../firebaseConfig";
import questionsData from "../data/questions.json"; 

const ExportQuestions: React.FC = () => {
  const uploadQuestionsToFirebase = async () => {
    const db = getDatabase(app);
    const questionsRef = ref(db, "Questions"); 

    try {
      await set(questionsRef, questionsData);
      alert("✅ Questions uploaded successfully!");
    } catch (error) {
      console.error("❌ Error uploading questions:", error);
      alert("Failed to upload questions.");
    }
  };

  return (
    <div>
      <h1>Add Questions</h1>
      <button onClick={uploadQuestionsToFirebase}>Upload Questions to Firebase</button>
    </div>
  );
};

export default ExportQuestions;
