const API_BASE_URL = '/api';

export const getAccessToken = () => localStorage.getItem('access_token');
export const setAccessToken = (token) => localStorage.setItem('access_token', token);
export const removeAccessToken = () => localStorage.removeItem('access_token');

export const getRefreshToken = () => localStorage.getItem('refresh_token');
export const setRefreshToken = (token) => localStorage.setItem('refresh_token', token);
export const removeRefreshToken = () => localStorage.removeItem('refresh_token');

export const fetchExercises = async () => {
    const response = await fetch(`${API_BASE_URL}/exercises/`);
    if (!response.ok) {
        throw new Error('Failed to fetch exercises');
    }
    return response.json();
};

export const fetchExerciseDetail = async (id) => {
    const response = await fetch(`${API_BASE_URL}/exercises/${id}/`);
    if (!response.ok) {
        throw new Error('Не удалось загрузить упражнение');
    }
    return response.json();
};

export const updateExercise = async (accessToken, id, exerciseData) => {
    const response = await fetch(`${API_BASE_URL}/exercises/${id}/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(exerciseData),
    });
    if (!response.ok) {
        throw new Error('Не удалось сохранить изменения');
    }
    return response.json();
};

export const deleteExercise = async (accessToken, id) => {
    const response = await fetch(`${API_BASE_URL}/exercises/${id}/`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });
    if (!response.ok) {
        throw new Error('Не удалось удалить упражнение');
    }
    return;
};

export const createExercise = async (accessToken, exerciseData) => {
    const response = await fetch(`${API_BASE_URL}/exercises/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(exerciseData),
    });

    if (!response.ok) {
        throw new Error('Не удалось добавить упражнение');
    }

    return response.json();
};

export const fetchWorkouts = async (accessToken) => {
    const response = await fetch(`${API_BASE_URL}/workouts/`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error('Не удалось загрузить тренировки');
    }

    return response.json();
};

export const fetchMyWorkouts = async (accessToken) => {
    const response = await fetch(`${API_BASE_URL}/workouts/`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error('Не удалось загрузить тренировки');
    }

    return response.json();
};

export const fetchWorkoutDetail = async (accessToken, id) => {
    const response = await fetch(`${API_BASE_URL}/workouts/${id}/`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        }
    });

    if (!response.ok) {
        throw new Error('Не удалось загрузить детали тренировки');
    }

    return await response.json();
};

export const updateWorkout = async (accessToken, id, data) => {
    const response = await fetch(`${API_BASE_URL}/workouts/${id}/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Не удалось обновить тренировку');
    }

    return await response.json();
};

export const deleteWorkout = async (accessToken, id) => {
    const response = await fetch(`${API_BASE_URL}/workouts/${id}/`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error('Не удалось удалить тренировку');
    }
    return response.status;
};

export const createWorkout = async (accessToken, workoutData) => {
    const response = await fetch(`${API_BASE_URL}/workouts/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(workoutData),
    });

    if (!response.ok) {
        throw new Error('Не удалось создать тренировку');
    }

    return await response.json();
};

// Workout Plans API
export const fetchWorkoutPlans = async (accessToken) => {
    const response = await fetch(`${API_BASE_URL}/workout-plans/`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error('Не удалось загрузить планы тренировок');
    }

    return response.json();
};

export const createWorkoutPlan = async (accessToken, planData) => {
    const response = await fetch(`${API_BASE_URL}/workout-plans/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(planData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Не удалось создать план тренировки');
    }

    return response.json();
};

export const deleteWorkoutPlan = async (accessToken, id) => {
    const response = await fetch(`${API_BASE_URL}/workout-plans/${id}/`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error('Не удалось удалить план тренировки');
    }

    return response.status;
};