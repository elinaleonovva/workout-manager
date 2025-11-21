import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import useAuth from "../hooks/useAuth";
import Loader from "./Loader";
import "./ExerciseList.css";

const ExerciseList = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const { isAdmin } = useAuth();

  useEffect(() => {
    api.get("/exercises/")
      .then((response) => {
        setExercises(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Ошибка при загрузке упражнений:", error);
        setLoading(false);
      });
  }, []);

  const handleCardClick = (exercise) => {
    setSelectedExercise(exercise);
  };

  const handleCloseModal = () => {
    setSelectedExercise(null);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  const handleEditClick = (e, exerciseId) => {
    e.stopPropagation(); // Предотвращаем открытие попапа при клике на кнопку редактирования
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="exercise-list-container">
      <div className="container">
        <h1 className="exercise-list-title">Список упражнений</h1>
        
        <div className="exercise-cards-grid">
          {exercises.map((exercise) => (
            <div
              key={exercise.id}
              className="exercise-card"
              onClick={() => handleCardClick(exercise)}
            >
              <div className="exercise-card-header">
                <h3 className="exercise-card-title">{exercise.name}</h3>
                {isAdmin && (
                  <Link
                    to={`/exercises/${exercise.id}`}
                    className="exercise-card-edit-btn"
                    onClick={(e) => handleEditClick(e, exercise.id)}
                    title="Редактировать упражнение"
                  >
                    ✎
                  </Link>
                )}
              </div>
              <p className="exercise-card-muscle-group">
                <span className="exercise-card-label">Группа мышц:</span> {exercise.muscle_group}
              </p>
            </div>
          ))}
        </div>

        {isAdmin && (
          <div className="exercise-list-actions">
            <Link to="/add-exercise" className="btn btn-success">
              + Добавить упражнение
            </Link>
          </div>
        )}
      </div>

      {selectedExercise && (
        <div
          className="exercise-modal-backdrop"
          onClick={handleBackdropClick}
        >
          <div className="exercise-modal">
            <button
              className="exercise-modal-close"
              onClick={handleCloseModal}
              aria-label="Закрыть"
            >
              ×
            </button>
            <div className="exercise-modal-content">
              <h2 className="exercise-modal-title">{selectedExercise.name}</h2>
              
              <div className="exercise-modal-section">
                <h3 className="exercise-modal-section-title">Группа мышц:</h3>
                <p className="exercise-modal-text">{selectedExercise.muscle_group}</p>
              </div>

              <div className="exercise-modal-section">
                <h3 className="exercise-modal-section-title">Инвентарь:</h3>
                <p className="exercise-modal-text">
                  {selectedExercise.equipment || "не требуется"}
                </p>
              </div>

              <div className="exercise-modal-section">
                <h3 className="exercise-modal-section-title">Техника выполнения:</h3>
                <p className="exercise-modal-text">
                  {selectedExercise.technique || selectedExercise.description || "Информация отсутствует"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseList;
