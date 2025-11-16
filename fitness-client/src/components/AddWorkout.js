import React, { useState } from "react";
import api from "../api";

const AddWorkout = () => {
  const [message, setMessage] = useState("");

  const handleAddWorkout = () => {
    api
      .post("/workouts/")
      .then(() => {
        setMessage("Тренировка добавлена успешно!");
      })
      .catch((error) => {
        setMessage("Ошибка при добавлении тренировки.");
        console.error(error);
      });
  };

  return (
    <div>
      <h1>Добавить тренировку</h1>
      <button onClick={handleAddWorkout}>Добавить новую тренировку</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddWorkout;
