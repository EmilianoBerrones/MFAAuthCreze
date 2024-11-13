import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api.js"
import { REFRESH_TOKEN, ACCESS_TOKEN, TEMP_TOKEN } from "../constants.js";
import { useEffect, useState } from "react";

function ProtectedRoute({ children, allowTemp = false }) {
    const [isAuthorized, setIsAuthorized] = useState(null);
    const [tokenType, setTokenType] = useState(null); // 'temp' o 'access'

    useEffect(() => {
        auth().catch(() => {
            setIsAuthorized(false);
            setTokenType(null);
        });
    }, []);

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try {
            const res = await api.post("api/token/refresh", {
                refresh: refreshToken,
            });
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                setIsAuthorized(true);
                setTokenType('access');
            } else {
                setIsAuthorized(false);
                setTokenType(null);
            }
        } catch (error) {
            console.log(error);
            setIsAuthorized(false);
            setTokenType(null);
        }
    };

    const auth = async () => {
        // Primero verificar si hay un token temporal
        const tempToken = localStorage.getItem(TEMP_TOKEN);
        const accessToken = localStorage.getItem(ACCESS_TOKEN);

        // Si no hay ningún token, no está autorizado
        if (!tempToken && !accessToken) {
            setIsAuthorized(false);
            setTokenType(null);
            return;
        }

        // Si hay token temporal, verificar su validez
        if (tempToken) {
            try {
                const decoded = jwtDecode(tempToken);
                const tokenExpiration = decoded.exp;
                const now = Date.now() / 1000;

                if (tokenExpiration > now) {
                    setIsAuthorized(true);
                    setTokenType('temp');
                    return;
                }
            } catch (error) {
                console.log('Error decodificando token temporal:', error);
            }
        }

        // Si no hay token temporal válido, verificar token de acceso
        if (accessToken) {
            try {
                const decoded = jwtDecode(accessToken);
                const tokenExpiration = decoded.exp;
                const now = Date.now() / 1000;

                if (tokenExpiration < now) {
                    await refreshToken();
                } else {
                    setIsAuthorized(true);
                    setTokenType('access');
                }
            } catch (error) {
                console.log('Error decodificando access token:', error);
                setIsAuthorized(false);
                setTokenType(null);
            }
        } else {
            setIsAuthorized(false);
            setTokenType(null);
        }
    };

    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }

    // Si no está autorizado, redirigir a login
    if (!isAuthorized) {
        return <Navigate to="/login" />;
    }

    // Si tiene token temporal y la ruta no permite temporales
    if (tokenType === 'temp' && !allowTemp) {
        return <Navigate to="/mfa/setup" />;
    }

    return children;
}

export default ProtectedRoute;