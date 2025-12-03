import React, { useEffect, useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../api";
import useAuth from "../hooks/useAuth";
import Loader from "./Loader";
import "./ExerciseList.css";

const ExerciseList = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const { isAdmin } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Загружаем данные только если мы на главной странице
    if (location.pathname !== '/') {
      return;
    }

    const loadExercises = async () => {
      setLoading(true);
      try {
        // Добавляем timestamp для предотвращения кеширования
        const response = await api.get("/exercises/", {
          params: { _t: Date.now() }
        });
        // Сортируем упражнения по ID для сохранения стабильного порядка
        // Убеждаемся, что ID - это числа
        const sortedExercises = [...response.data].sort((a, b) => {
          const idA = Number(a.id);
          const idB = Number(b.id);
          return idA - idB;
        });
        setExercises(sortedExercises);
      } catch (error) {
        console.error("Ошибка при загрузке упражнений:", error);
      } finally {
        setLoading(false);
      }
    };

    loadExercises();
  }, [location.pathname, location.key]); // Перезагружаем при изменении маршрута или ключа навигации

  // Используем useMemo для стабильного порядка отображения
  const sortedExercises = useMemo(() => {
    if (!exercises || exercises.length === 0) return [];
    return [...exercises].sort((a, b) => {
      const idA = Number(a.id);
      const idB = Number(b.id);
      return idA - idB;
    });
  }, [exercises]);

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
              {sortedExercises.map((exercise) => (
            <div
              key={`exercise-${exercise.id}`}
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
