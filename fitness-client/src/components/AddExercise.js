import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import { createExercise } from "../utils/api";

const AddExercise = () => {
  const [name, setName] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const { accessToken, isAdmin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAdmin) {
      setMessage("У вас нет прав для добавления упражнений.");
      return;
    }

    try {
      await createExercise(accessToken, {
        name,
        muscle_group: muscleGroup,
        description,
      });

      setMessage("Упражнение добавлено успешно!");
      setName("");
      setMuscleGroup("");
      setDescription("");
    } catch (error) {
      console.error("Ошибка при добавлении упражнения:", error);
      setMessage("Ошибка при добавлении упражнения.");
    }
  };

  if (!isAdmin) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          У вас нет прав для добавления упражнений.
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-body">
          <h1 className="card-title text-center">Добавить упражнение</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="exerciseName" className="form-label">
                Название:
              </label>
              <input
                type="text"
                id="exerciseName"
                className="form-control"
                placeholder="Введите название"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="muscleGroup" className="form-label">
                Группа мышц:
              </label>
              <input
                type="text"
                id="muscleGroup"
                className="form-control"
                placeholder="Введите группу мышц"
                value={muscleGroup}
                onChange={(e) => setMuscleGroup(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Описание:
              </label>
              <textarea
                id="description"
                className="form-control"
                placeholder="Введите описание"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-success w-100">
              Добавить
            </button>
          </form>
          {message && <p className="text-center text-success mt-3">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default AddExercise;
