
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import {
  fetchWorkoutDetail,
  updateWorkout,
  deleteWorkout,
  fetchExercises,
} from "../utils/api";
import Loader from "./Loader";

const WorkoutDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const [workout, setWorkout] = useState(null);
  const [sets, setSets] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [exerciseId, setExerciseId] = useState("");
  const [repetitions, setRepetitions] = useState(0);
  const [weight, setWeight] = useState(0);
  const [newName, setNewName] = useState("");
  const [showRenameForm, setShowRenameForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadWorkout = async () => {
      try {
        const data = await fetchWorkoutDetail(accessToken, id);
        setWorkout(data);
        setSets(data.sets);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          alert("У вас недостаточно прав для просмотра этой тренировки.");
          navigate("/workouts/me");
        } else {
          console.error("Ошибка загрузки тренировки:", error);
          setError("Не удалось загрузить тренировку");
        }
      } finally {
        setLoading(false);
      }
    };

    loadWorkout();
  }, [id, navigate, accessToken]);

  useEffect(() => {
    const loadExercises = async () => {
      try {
        const data = await fetchExercises(accessToken);
        setExercises(data);
      } catch (error) {
        console.error("Ошибка загрузки упражнений:", error);
        setError("Не удалось загрузить упражнения");
      }
    };

    loadExercises();
  }, [accessToken]);

    const handleRename = async (e) => {
    e.preventDefault();

    try {
      const response = await updateWorkout(accessToken, id, { name: newName });
      if (!response) {
        throw new Error("Пустой ответ от сервера при переименовании тренировки");
      }
      setWorkout(response);
      setShowRenameForm(false);
    } catch (error) {
      console.error("Ошибка при переименовании тренировки:", error);
      setError("Не удалось переименовать тренировку");
    }
  };

  const getExerciseName = (exerciseId) => {
    const exercise = exercises.find((ex) => ex.id === exerciseId);
    return exercise ? exercise.name : "Упражнение не найдено";
  };

  const handleAddSet = async (e) => {
    e.preventDefault();

    const newSet = {
      exercise: exerciseId,
      repetitions,
      weight,
    };

    const updatedSets = [newSet];

    try {
      const response = await updateWorkout(accessToken, id, {
        sets: updatedSets,
      });
      if (!response) {
          throw new Error("Ответ от сервера пуст");
      }
      setSets(response.sets);
      setExerciseId("");
      setRepetitions(0);
      setWeight(0);
    } catch (error) {
      console.error("Ошибка при обновлении тренировки:", error);
      setError("Не удалось добавить подход");
    }
  };

  const handleDeleteWorkout = async () => {
    try {
      await deleteWorkout(accessToken, id);
      alert("Тренировка удалена!");
      navigate("/workouts/me");
    } catch (error) {
      if (error.response && error.response.status === 403) {
        alert("У вас недостаточно прав для удаления этой тренировки.");
        navigate("/workouts/me");
      } else {
        console.error("Ошибка при удалении тренировки:", error);
        setError("Не удалось удалить тренировку");
      }
    }
  };

  const handleExerciseChange = (e) => {
    const selectedValue = e.target.value;

    if (selectedValue === "add-new") {
      navigate("/add-exercise");
    } else {
      setExerciseId(selectedValue);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="container mt-4"><div className="alert alert-danger">{error}</div></div>;
  }

  if (!workout) return <div className="container mt-4"><p>Тренировка не найдена</p></div>;

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-body">
          <div className="d-flex flex-column" style={{ gap: 'var(--spacing-md)' }}>
            <div className="d-flex flex-column" style={{ gap: 'var(--spacing-sm)' }}>
              <h1 className="card-title">
                {workout.name || `Тренировка от ${workout.date}`}
              </h1>
              <button
                onClick={() => setShowRenameForm(!showRenameForm)}
                className="btn btn-outline-secondary"
                style={{ alignSelf: 'flex-start' }}
              >
                Переименовать
              </button>
            </div>
            {showRenameForm && (
              <form
                onSubmit={handleRename}
                className="d-flex flex-column"
                style={{ gap: 'var(--spacing-sm)', maxWidth: '400px' }}
              >
                <input
                  type="text"
                  placeholder="Введите новое имя"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                  className="form-control"
                />
                <button type="submit" className="btn btn-primary">
                  Сохранить
                </button>
              </form>
            )}
          </div>
          <p className="mt-3">
            <strong>Проработанные мышцы:</strong>{" "}
            {workout.muscles_involved?.length
              ? workout.muscles_involved.join(", ")
              : "Не указано"}
          </p>
          <h2 className="mt-4">Подходы:</h2>
          <ul className="list-group mb-4">
            {sets.map((set, index) => (
              <li
                key={index}
                className="list-group-item"
              >
                <span>
                  Упражнение: <strong>{getExerciseName(set.exercise)}</strong>,
                  Повторы: {set.repetitions}, Вес: {set.weight} кг
                </span>
              </li>
            ))}
          </ul>
          <h2 className="mt-4">Добавить подход</h2>
          <form onSubmit={handleAddSet} className="mt-3">
            <div className="form-group">
              <label className="form-label">Упражнение:</label>
              <select
                value={exerciseId}
                onChange={handleExerciseChange}
                required
                className="form-select"
              >
                <option value="" disabled>
                  Выберите упражнение
                </option>
                {exercises.map((exercise) => (
                  <option key={exercise.id} value={exercise.id}>
                    {exercise.name}
                  </option>
                ))}
                <option value="add-new">+ Добавить новое упражнение</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Повторы:</label>
              <input
                type="number"
                value={repetitions}
                onChange={(e) => setRepetitions(Number(e.target.value))}
                required
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Вес (кг):</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                required
                className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-success">
              Добавить подход
            </button>
          </form>
        </div>
        <div className="card-footer text-center">
          <button onClick={handleDeleteWorkout} className="btn btn-danger">
            Удалить тренировку
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutDetail;
