import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { fetchMyWorkouts, fetchExercises, createWorkoutPlan, fetchWorkoutPlans, deleteWorkoutPlan } from "../utils/api";
import Loader from "./Loader";

const MyWorkouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [plans, setPlans] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState("");
  const [startDate, setStartDate] = useState("");
  const [frequencyDays, setFrequencyDays] = useState("");
  const [planMessage, setPlanMessage] = useState("");
  const { accessToken } = useAuth();

  const handleFrequencyChange = (e) => {
    const value = e.target.value;
    // Разрешаем только цифры
    if (value === "" || /^\d+$/.test(value)) {
      setFrequencyDays(value);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [workoutsData, plansData, exercisesData] = await Promise.all([
          fetchMyWorkouts(accessToken),
          fetchWorkoutPlans(accessToken),
          fetchExercises()
        ]);
        setWorkouts(workoutsData);
        setPlans(plansData);
        setExercises(exercisesData);
      } catch (err) {
        setError(err.message || "Не удалось загрузить данные");
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      loadData();
    }
  }, [accessToken]);

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    setPlanMessage("");

    if (!selectedExercise || !startDate || !frequencyDays) {
      setPlanMessage("Пожалуйста, заполните все поля");
      return;
    }

    const frequencyValue = parseInt(frequencyDays);
    if (isNaN(frequencyValue) || frequencyValue < 1) {
      setPlanMessage("Периодичность должна быть числом не менее 1");
      return;
    }

    try {
      await createWorkoutPlan(accessToken, {
        exercise: parseInt(selectedExercise),
        start_date: startDate,
        frequency_days: frequencyValue,
        is_active: true
      });

      setShowPlanForm(false);
      setSelectedExercise("");
      setStartDate("");
      setFrequencyDays("");
      setPlanMessage("");
      
      // Перезагружаем данные
      const [workoutsData, plansData] = await Promise.all([
        fetchMyWorkouts(accessToken),
        fetchWorkoutPlans(accessToken)
      ]);
      setWorkouts(workoutsData);
      setPlans(plansData);
    } catch (err) {
      setPlanMessage(err.message || "Не удалось создать план тренировки");
    }
  };

  const handleDeletePlan = async (planId) => {
    if (!window.confirm("Вы уверены, что хотите удалить этот план тренировки?")) {
      return;
    }

    try {
      await deleteWorkoutPlan(accessToken, planId);
      
      // Перезагружаем данные
      const [workoutsData, plansData] = await Promise.all([
        fetchMyWorkouts(accessToken),
        fetchWorkoutPlans(accessToken)
      ]);
      setWorkouts(workoutsData);
      setPlans(plansData);
    } catch (err) {
      alert(err.message || "Не удалось удалить план тренировки");
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="container mt-4"><div className="alert alert-danger">{error}</div></div>;
  }

  const hasAnyData = workouts.length > 0 || plans.length > 0;

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Мои тренировки</h1>

      {!hasAnyData && !showPlanForm ? (
        <div className="card">
          <div className="card-body text-center">
            <p className="card-text">У вас пока нет активных тренировок.</p>
            <p className="card-text">Создайте план тренировки, выбрав упражнение из списка:</p>
            <button 
              className="btn btn-success mt-3"
              onClick={() => setShowPlanForm(true)}
            >
              Создать план тренировки
            </button>
          </div>
        </div>
      ) : !hasAnyData && showPlanForm ? (
        <div className="card">
          <div className="card-body">
            <h2 className="card-title text-center mb-4">Создать план тренировки</h2>
            <form onSubmit={handleCreatePlan}>
              <div className="form-group">
                <label htmlFor="exercise" className="form-label">
                  Выберите упражнение из раздела "Главная":
                </label>
                <select
                  id="exercise"
                  className="form-select"
                  value={selectedExercise}
                  onChange={(e) => setSelectedExercise(e.target.value)}
                  required
                >
                  <option value="">-- Выберите упражнение --</option>
                  {exercises.map((exercise) => (
                    <option key={exercise.id} value={exercise.id}>
                      {exercise.name} ({exercise.muscle_group})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="startDate" className="form-label">
                  Дата первой тренировки:
                </label>
                <input
                  type="date"
                  id="startDate"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="frequency" className="form-label">
                  Периодичность (дней между тренировками):
                </label>
                <input
                  type="text"
                  id="frequency"
                  className="form-control"
                  value={frequencyDays}
                  onChange={handleFrequencyChange}
                  placeholder="Введите число"
                  required
                />
                {frequencyDays && (
                  <small className="text-secondary">
                    Тренировки будут автоматически добавляться в календарь каждые {frequencyDays} {parseInt(frequencyDays) === 1 ? 'день' : parseInt(frequencyDays) < 5 ? 'дня' : 'дней'}
                  </small>
                )}
              </div>

              {planMessage && (
                <div className={`alert ${planMessage.includes('успешно') ? 'alert-success' : 'alert-danger'} mt-3`}>
                  {planMessage}
                </div>
              )}

              <div className="d-flex gap-2 mt-4">
                <button type="submit" className="btn btn-success w-100">
                  Создать план
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowPlanForm(false);
                    setPlanMessage("");
                    setSelectedExercise("");
                    setStartDate("");
                    setFrequencyDays("");
                  }}
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <>
          {plans.length > 0 && (
            <div className="mb-4">
              <h2 className="mb-3">Активные планы тренировок</h2>
              <div className="d-flex flex-column gap-3">
                {plans.map(plan => (
                  <div key={plan.id} className="card">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <h4 className="card-title">{plan.exercise_name}</h4>
                          <p className="card-text">
                            <strong>Группа мышц:</strong> {plan.exercise_muscle_group}
                          </p>
                          <p className="card-text">
                            <strong>Начало:</strong> {new Date(plan.start_date).toLocaleDateString('ru-RU')}
                          </p>
                          <p className="card-text">
                            <strong>Периодичность:</strong> каждые {plan.frequency_days} {plan.frequency_days === 1 ? 'день' : plan.frequency_days < 5 ? 'дня' : 'дней'}
                          </p>
                          <p className="card-text">
                            <strong>Следующие тренировки:</strong> {plan.next_dates.slice(0, 3).map(d => new Date(d).toLocaleDateString('ru-RU')).join(', ')}
                            {plan.next_dates.length > 3 && '...'}
                          </p>
                        </div>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeletePlan(plan.id)}
                          title="Удалить план тренировки"
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {workouts.length > 0 && (
            <div className={plans.length > 0 ? "mt-4" : ""}>
              <h2 className="mb-3">Выполненные тренировки</h2>
              <div className="d-flex flex-column align-items-center gap-4">
                {workouts.map((workout) => (
                  <div key={workout.id} className="card w-75">
                    <div className="card-body">
                      <h2 className="card-title">
                        {workout.name || `Тренировка от ${workout.date}`}
                      </h2>
                      <p className="card-text">
                        <strong>Проработанные мышцы:</strong>{" "}
                        {workout.muscles_involved?.length
                          ? workout.muscles_involved.join(", ")
                          : "Не указано"}
                      </p>
                    </div>
                    <div className="card-footer text-center">
                      <Link to={`/workouts/${workout.id}`} className="btn btn-primary">
                        Подробнее...
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {showPlanForm && hasAnyData && (
        <div className="card mt-4">
          <div className="card-body">
            <h2 className="card-title text-center mb-4">Создать план тренировки</h2>
            <form onSubmit={handleCreatePlan}>
              <div className="form-group">
                <label htmlFor="exercise" className="form-label">
                  Выберите упражнение из раздела "Главная":
                </label>
                <select
                  id="exercise"
                  className="form-select"
                  value={selectedExercise}
                  onChange={(e) => setSelectedExercise(e.target.value)}
                  required
                >
                  <option value="">-- Выберите упражнение --</option>
                  {exercises.map((exercise) => (
                    <option key={exercise.id} value={exercise.id}>
                      {exercise.name} ({exercise.muscle_group})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="startDate" className="form-label">
                  Дата первой тренировки:
                </label>
                <input
                  type="date"
                  id="startDate"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="frequency" className="form-label">
                  Периодичность (дней между тренировками):
                </label>
                <input
                  type="text"
                  id="frequency"
                  className="form-control"
                  value={frequencyDays}
                  onChange={handleFrequencyChange}
                  placeholder="Введите число"
                  required
                />
                {frequencyDays && (
                  <small className="text-secondary">
                    Тренировки будут автоматически добавляться в календарь каждые {frequencyDays} {parseInt(frequencyDays) === 1 ? 'день' : parseInt(frequencyDays) < 5 ? 'дня' : 'дней'}
                  </small>
                )}
              </div>

              {planMessage && (
                <div className={`alert ${planMessage.includes('успешно') ? 'alert-success' : 'alert-danger'} mt-3`}>
                  {planMessage}
                </div>
              )}

              <div className="d-flex gap-2 mt-4">
                <button type="submit" className="btn btn-success w-100">
                  Создать план
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowPlanForm(false);
                    setPlanMessage("");
                    setSelectedExercise("");
                    setStartDate("");
                    setFrequencyDays("");
                  }}
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {!showPlanForm && hasAnyData && (
        <div className="text-center mt-4">
          <button 
            className="btn btn-outline-secondary"
            onClick={() => setShowPlanForm(true)}
          >
            Создать новый план тренировки
          </button>
        </div>
      )}
    </div>
  );
};

export default MyWorkouts;

