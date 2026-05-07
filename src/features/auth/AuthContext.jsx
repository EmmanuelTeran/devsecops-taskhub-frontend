import { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider } from '../../config/firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Un "listener" que avisa si el usuario inicia o cierra sesión
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const loginWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error("Error en SSO:", error);
        }
    };

    const logout = () => signOut(auth);

    // Función vital: Obtiene el token fresco para enviarlo a nuestro backend de Node.js
    const getToken = async () => {
        if (user) return await user.getIdToken();
        return null;
    };

    return (
        <AuthContext.Provider value={{ user, loginWithGoogle, logout, getToken, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);