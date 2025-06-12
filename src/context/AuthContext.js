import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setIsAuthenticated(true);
            } catch (e) {
                console.error("Failed to parse user from localStorage", e);
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const response = await axios.get(`http://localhost:5000/users?username=${username}&password=${password}`);
            if (response.data.length > 0) {
                const fetchedUser = response.data[0];
                const userPayload = {
                    id: fetchedUser.id,
                    username: fetchedUser.username,
                    role: fetchedUser.role
                };
                setUser(userPayload);
                setIsAuthenticated(true);
                localStorage.setItem('user', JSON.stringify(userPayload));
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error("Login error:", error);
            return false;
        }
    };

    const register = async (username, password) => {
        try {
            const checkUser = await axios.get(`http://localhost:5000/users?username=${username}`);
            if (checkUser.data.length > 0) {
                return false;
            }

            const newUser = {
                id: `user${Date.now()}`,
                username,
                password,
                role: 'user'
            };
            const userResponse = await axios.post('http://localhost:5000/users', newUser);

            await axios.post('http://localhost:5000/wallets', { userId: newUser.id, balances: {} });

            return true;
        } catch (error) {
            console.error("Registration error:", error);
            return false;
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('user');
    };

    const userId = user ? user.id : null;
    const username = user ? user.username : null;
    const userRole = user ? user.role : null;

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, userId, username, userRole, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);