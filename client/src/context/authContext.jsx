import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser && token) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                console.error("שגיאה בפענוח נתוני משתמש מהלוקאל סטורג'", e);
            }
        }
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, { email, password });
            const { token, user } = response.data;

            setToken(token);
            setUser(user);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            return { success: true };
        } catch (error) {
            console.error("Login Error:", error.response?.data);
            return { success: false, message: error.response?.data?.message || 'התחברות נכשלה' };
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
    };

    const signup = async (userData) => {
        try {
            await axios.post(`${API_URL}/auth/signup`, userData);
            return { success: true };
        } catch (error) {
            console.error("Signup Error:", error.response?.data);
            return { success: false, message: error.response?.data?.message || 'הרשמה נכשלה' };
        }
    };

    const updateUserInfo = (newData) => {
        const updatedUser = { ...user, ...newData };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            login,
            signup,
            logout,
            updateUserInfo,
            isAuthenticated: !!token
        }}>
            {children}
        </AuthContext.Provider>
    );
};