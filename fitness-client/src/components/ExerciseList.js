import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";


const ExerciseList = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return <p>Загрузка...</p>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center">Список упражнений</h1>
      <div className="card">
        <div className="card-body">
          <table className="table">
            <thead>
              <tr>
                <th>Название</th>
                <th>Группа мышц</th>
                <th>Описание</th>
              </tr>
            </thead>
            <tbody>
              {exercises.map((exercise) => (
                <tr key={exercise.id}>
                  <td>
                    {isAdmin ? (
                      <Link to={`/exercises/${exercise.id}`}>{exercise.name}</Link>
                    ) : (
                      <span>{exercise.name}</span>
                    )}
                  </td>
                  <td>{exercise.muscle_group}</td>
                  <td>{exercise.description}</td>
                </tr>
              ))}
              {!isAdmin && (
                <tr>
                  <td colSpan="3" className="text-center">
                    <Link to='/add-exercise' className="btn btn-success">
                      + Добавить упражнение
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExerciseList;
