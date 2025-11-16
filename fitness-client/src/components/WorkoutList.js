import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { fetchWorkouts } from "../utils/api";
import Loader from "./Loader";

const WorkoutList = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { accessToken } = useAuth();

  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        const data = await fetchWorkouts(accessToken);
        setWorkouts(data);
      } catch (err) {
        setError(err.message || "Не удалось загрузить тренировки");
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      loadWorkouts();
    }
  }, [accessToken]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="container mt-4"><div className="alert alert-danger">{error}</div></div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="text-center">Мои тренировки</h1>
      <div className="row">
        {workouts.map((workout) => (
          <div key={workout.id} className="col-md-4">
            <div className="card h-100">
              <div className="card-body">
                <h3 className="card-title">Тренировка</h3>
                <p className="card-text">
                  <strong>Дата:</strong> {workout.date}
                </p>
                <p className="card-text">
                  <strong>Количество подходов:</strong> {workout.sets_count || 0}
                </p>
              </div>
              <div className="card-footer text-center">
                <Link to={`/workouts/${workout.id}`} className="btn btn-primary">
                  Подробнее
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutList;

