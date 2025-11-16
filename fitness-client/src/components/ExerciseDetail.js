import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { fetchExerciseDetail, updateExercise, deleteExercise } from "../utils/api";
import Loader from "./Loader";

const ExerciseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accessToken, isAdmin } = useAuth();

  const [exercise, setExercise] = useState(null);
  const [name, setName] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadExercise = async () => {
      try {
        const data = await fetchExerciseDetail(id);
        setExercise(data);
        setName(data.name);
        setMuscleGroup(data.muscle_group);
        setDescription(data.description);
      } catch (err) {
        setError(err.message || "Не удалось загрузить упражнение");
      } finally {
        setLoading(false);
      }
    };

    loadExercise();
  }, [id]);

  const handleSave = async () => {
    try {
      await updateExercise(accessToken, id, { name, muscle_group: muscleGroup, description });
      alert("Изменения сохранены!");
    } catch (err) {
      setError(err.message || "Не удалось сохранить изменения");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteExercise(accessToken, id);
      alert("Упражнение удалено!");
      navigate("/");
    } catch (err) {
      setError(err.message || "Не удалось удалить упражнение");
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="container mt-5"><div className="alert alert-danger">{error}</div></div>;
  }

  if (!exercise) return <div className="container mt-5"><p>Упражнение не найдено.</p></div>;

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-body">
          <h1 className="card-title text-center mb-4">{exercise.name}</h1>
          <form>
            <div className="form-group">
              <label htmlFor="exerciseName" className="form-label">
                Переименовать:
              </label>
              <input
                id="exerciseName"
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isAdmin}
              />
            </div>
            <div className="form-group">
              <label htmlFor="muscleGroup" className="form-label">
                Рабочая мышца:
              </label>
              <input
                id="muscleGroup"
                type="text"
                className="form-control"
                value={muscleGroup}
                onChange={(e) => setMuscleGroup(e.target.value)}
                disabled={!isAdmin}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Описание:
              </label>
              <textarea
                id="description"
                className="form-control"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={!isAdmin}
              ></textarea>
            </div>
            <div className="d-flex justify-content-between" style={{ gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-success"
                onClick={handleSave}
                disabled={!isAdmin}
                style={{ flex: '1', minWidth: '150px' }}
              >
                Сохранить изменения
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={!isAdmin}
                style={{ flex: '1', minWidth: '150px' }}
              >
                Удалить упражнение
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetail;
