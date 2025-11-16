import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ExerciseList from './components/ExerciseList';
import AddExercise from './components/AddExercise';
import MyWorkouts from './components/MyWorkouts';
import ExerciseDetail from './components/ExerciseDetail';
import NewWorkout from './components/NewWorkout';
import WorkoutDetail from './components/WorkoutDetail';
import WorkoutList from './components/WorkoutList';
import UnauthorizedAdmin from './components/Unauthorized';
import Navigation from './components/Navigation';
import Calendar from './components/Calendar';
import useAuth from './hooks/useAuth';
import { AuthProvider } from './context/AuthContext';
import Loader from './components/Loader';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Navigation />
                <AppContent />
            </Router>
        </AuthProvider>
    );
};

const AppContent = () => {
    const { accessToken, isAdmin, loading } = useAuth();

    if (loading) {
        return <Loader />;
    }

    return (
        <Routes>
            <Route path="/" element={<ExerciseList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized-admin" element={<UnauthorizedAdmin />} />
            {/* Защищённые маршруты */}
            <Route
                path="/add-exercise"
                element={accessToken && isAdmin ? <AddExercise /> : <Navigate to="/unauthorized-admin" />}
            />
            <Route
                path="/workouts/me"
                element={accessToken ? <MyWorkouts /> : <Navigate to="/login" />}
            />
            <Route
                path="/exercises/:id"
                element={accessToken && isAdmin ? <ExerciseDetail /> : <Navigate to="/unauthorized-admin" />}
            />
            <Route
                path="/workouts/new"
                element={accessToken ? <NewWorkout /> : <Navigate to="/login" />}
            />
            <Route
                path="/workouts/:id"
                element={accessToken ? <WorkoutDetail /> : <Navigate to="/login" />}
            />
            <Route
                path="/calendar"
                element={accessToken ? <Calendar /> : <Navigate to="/login" />}
            />
        </Routes>
    );
};

export default App;