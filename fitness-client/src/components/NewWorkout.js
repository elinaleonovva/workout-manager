import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { createWorkout } from "../utils/api";

const NewWorkout = () => {
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const handleCreateWorkout = async (e) => {
    e.preventDefault();

    const newWorkout = {
      date,
      sets: [],
      ...(name && { name }),
    };

    try {
      const response = await createWorkout(accessToken, newWorkout);
      setMessage("Тренировка успешно добавлена!");
      navigate(`/workouts/${response.id}`);
    } catch (error) {
      console.error("Ошибка при добавлении тренировки:", error.response?.data || error);
      setMessage("Ошибка при добавлении тренировки.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-body">
          <h1 className="card-title text-center">Добавить новую тренировку</h1>
          <form onSubmit={handleCreateWorkout}>
            <div className="form-group">
              <label htmlFor="workoutName" className="form-label">
                Имя тренировки (необязательно):
              </label>
              <input
                type="text"
                id="workoutName"
                className="form-control"
                placeholder="Введите имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="workoutDate" className="form-label">
                Дата тренировки:
              </label>
              <input
                type="date"
                id="workoutDate"
                className="form-control"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-success w-100">
              Создать тренировку
            </button>
          </form>
          {message && <p className="text-center text-success mt-3">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default NewWorkout;

