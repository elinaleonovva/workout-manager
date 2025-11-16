import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Navigation = () => {
    const { accessToken, removeTokens, isAdmin } = useAuth();

    const handleLogout = () => {
        removeTokens();
    };

    return (
        <nav className="navbar">
            <div className="container">
                <div className="navbar-content">
                    <div className="nav-links">
                        <Link to="/" className="navbar-brand">
                            Главная
                        </Link>
                        {accessToken && (
                            <>
                                <Link to="/workouts/me" className="nav-link">
                                    Мои тренировки
                                </Link>
                                <Link to="/calendar" className="nav-link">
                                    Календарь
                                </Link>
                            </>
                        )}
                        {isAdmin && (
                            <Link to="/add-exercise" className="nav-link">
                                Добавить упражнение
                            </Link>
                        )}
                    </div>

                    <div className="navbar-actions">
                        {accessToken ? (
                            <button onClick={handleLogout} className="btn btn-danger">Выйти</button>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-primary">
                                    Войти
                                </Link>
                                <Link to="/register" className="btn btn-secondary">
                                    Регистрация
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
