import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const UnauthorizedAdmin = () => {
  const { removeTokens } = useAuth();
  const navigate = useNavigate();

  const handleRelogin = () => {
    removeTokens();
    navigate('/login');
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-center">
        <div style={{ maxWidth: '600px', width: '100%' }}>
          <div className="alert alert-danger text-center">
            <h4 style={{ marginBottom: 'var(--spacing-md)', fontWeight: 600 }}>Недостаточно прав!</h4>
            <p>
              Вы пытаетесь выполнить действие, которое доступно только администраторам.
              Пожалуйста, выполните вход как администратор, чтобы продолжить.
            </p>
            <hr style={{ borderColor: 'rgba(231, 76, 60, 0.3)', margin: 'var(--spacing-lg) 0' }} />
            <button className="btn btn-primary" onClick={handleRelogin}>
              Войти как администратор
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedAdmin;

