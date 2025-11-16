import React, { createContext, useState, useEffect, useCallback } from 'react';
import { getRefreshToken, setRefreshToken, removeRefreshToken, getAccessToken, setAccessToken, removeAccessToken } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessTokenState] = useState(getAccessToken());
    const [refreshToken, setRefreshTokenState] = useState(getRefreshToken());
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    const setTokens = (access, refresh) => {
        setAccessTokenState(access);
        setRefreshTokenState(refresh);
        setAccessToken(access);
        setRefreshToken(refresh);
    }

    const removeTokens = useCallback(() => {
        setAccessTokenState(null);
        setRefreshTokenState(null);
        removeAccessToken();
        removeRefreshToken();
        setUser(null);
        setIsAdmin(false);
    }, []);

    const fetchUserData = useCallback(async (access) => {
        try {
            const response = await fetch('/api/is_admin/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${access}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }
            const data = await response.json();
            setIsAdmin(data.is_admin);
            setUser(data);
        } catch (error) {
            console.error('Error fetching user data:', error);
            removeTokens();
        } finally {
            setLoading(false);
        }
    }, [removeTokens]);

    useEffect(() => {
        console.log('useEffect запущен, accessToken:', accessToken);
        if (accessToken) {
            fetchUserData(accessToken);
        } else {
            setLoading(false);
        }
    }, [accessToken, fetchUserData]);

    const contextData = {
        accessToken,
        refreshToken,
        user,
        isAdmin,
        setTokens,
        removeTokens,
        loading,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;

