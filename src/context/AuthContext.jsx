import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

const loadFromStorage = (key, fallback) => {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : fallback;
    } catch { return fallback; }
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => loadFromStorage('eventhub_user', null));

    const [registeredUsers, setRegisteredUsers] = useState(() =>
        loadFromStorage('eventhub_registeredUsers', [
            { name: 'Admin', email: 'admin@eventhub.com', password: 'admin123', role: 'Admin' }
        ])
    );

    // Persist to localStorage whenever data changes
    useEffect(() => {
        localStorage.setItem('eventhub_registeredUsers', JSON.stringify(registeredUsers));
    }, [registeredUsers]);

    useEffect(() => {
        if (user) {
            localStorage.setItem('eventhub_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('eventhub_user');
        }
    }, [user]);

    const signup = (name, email, password, role) => {
        const exists = registeredUsers.find(
            (u) => u.email.toLowerCase() === email.toLowerCase()
        );
        if (exists) {
            return { success: false, message: 'An account with this email already exists' };
        }
        const newUser = { name, email, password, role };
        setRegisteredUsers((prev) => [...prev, newUser]);
        return { success: true };
    };

    const login = (email, password, expectedRole) => {
        const found = registeredUsers.find(
            (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        if (!found) {
            return { success: false, message: 'Invalid email or password' };
        }
        if (expectedRole && found.role !== expectedRole) {
            return { success: false, message: `This account is not registered as ${expectedRole}` };
        }
        setUser({ name: found.name, email: found.email, role: found.role });
        return { success: true, role: found.role };
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, registeredUsers, signup, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

export default AuthContext;
