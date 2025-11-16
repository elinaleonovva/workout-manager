import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { fetchWorkoutPlans } from "../utils/api";
import Loader from "./Loader";

const Calendar = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { accessToken } = useAuth();

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const data = await fetchWorkoutPlans(accessToken);
        setPlans(data);
      } catch (err) {
        setError(err.message || "Не удалось загрузить планы тренировок");
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      loadPlans();
    }
  }, [accessToken]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Добавляем пустые ячейки для дней предыдущего месяца
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Добавляем дни текущего месяца
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getWorkoutDatesForMonth = () => {
    const workoutDates = new Set();
    
    plans.forEach(plan => {
      plan.next_dates.forEach(dateStr => {
        const date = new Date(dateStr);
        if (date.getMonth() === currentMonth.getMonth() && 
            date.getFullYear() === currentMonth.getFullYear()) {
          workoutDates.add(dateStr);
        }
      });
    });

    return workoutDates;
  };

  const getWorkoutsForDate = (date) => {
    if (!date) return [];
    
    const dateStr = date.toISOString().split('T')[0];
    const workouts = [];
    
    plans.forEach(plan => {
      if (plan.next_dates.includes(dateStr)) {
        workouts.push(plan);
      }
    });

    return workouts;
  };

  const monthNames = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
  ];

  const dayNames = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const days = getDaysInMonth(currentMonth);
  const workoutDates = getWorkoutDatesForMonth();
  const today = new Date();
  const isToday = (date) => {
    if (!date) return false;
    return date.toDateString() === today.toDateString();
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="container mt-4"><div className="alert alert-danger">{error}</div></div>;
  }

  if (plans.length === 0) {
    return (
      <div className="container mt-4">
        <h1 className="text-center mb-4">Календарь тренировок</h1>
        <div className="card">
          <div className="card-body text-center">
            <p className="card-text">У вас пока нет добавленных планов тренировок.</p>
            <p className="card-text">Перейдите в раздел "Мои тренировки" чтобы создать план.</p>
            <Link to="/workouts/me" className="btn btn-primary mt-3">
              Создать план тренировки
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Календарь тренировок</h1>
      
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4 calendar-navigation">
            <button 
              className="btn btn-outline-secondary calendar-nav-btn"
              onClick={() => navigateMonth(-1)}
            >
              <span className="calendar-btn-text">
                <span className="calendar-btn-line">Предыдущий</span>
                <span className="calendar-btn-line">месяц</span>
              </span>
            </button>
            <h2 className="mb-0 calendar-month-title">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h2>
            <button 
              className="btn btn-outline-secondary calendar-nav-btn"
              onClick={() => navigateMonth(1)}
            >
              <span className="calendar-btn-text">
                <span className="calendar-btn-line">Следующий</span>
                <span className="calendar-btn-line">месяц</span>
              </span>
            </button>
          </div>

          <div className="calendar-wrapper">
            <div className="calendar-grid">
            {dayNames.map(day => (
              <div key={day} className="calendar-day-header">
                {day}
              </div>
            ))}

            {days.map((date, index) => {
              const workouts = getWorkoutsForDate(date);
              const hasWorkout = workouts.length > 0;
              const isCurrentDay = isToday(date);

              return (
                <div
                  key={index}
                  className={`calendar-day ${!date ? 'empty' : ''} ${isCurrentDay ? 'today' : ''} ${hasWorkout ? 'has-workout' : ''}`}
                >
                  {date && (
                    <>
                      <div className="calendar-day-number">{date.getDate()}</div>
                      {hasWorkout && (
                        <div className="calendar-workouts">
                          {workouts.map(plan => (
                            <div 
                              key={plan.id} 
                              className="calendar-workout-badge"
                              title={plan.exercise_name}
                            >
                              {plan.exercise_name}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
            </div>
          </div>

          <div className="mt-4">
            <h3>Активные планы тренировок:</h3>
            <div className="d-flex flex-column gap-3">
              {plans.map(plan => (
                <div key={plan.id} className="card">
                  <div className="card-body">
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;

