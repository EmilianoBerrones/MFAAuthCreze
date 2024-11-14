import React from 'react';
import {Container, Typography, Button, Box, Icon} from '@mui/material';
import ScreenLockPortraitIcon from '@mui/icons-material/ScreenLockPortrait';
import api from "../api.js";
import {Navigate, useNavigate} from "react-router-dom";


const SetupMFA = () => {
    const navigate = useNavigate();  // Hook de navegación

    const handleLogout = async () => {
        localStorage.clear();  // Limpia el almacenamiento local
        navigate('/login');  // Redirige a la página de login
    };

    const handleNavigateEnable = () => {
        navigate('/MFAEnable')
    }

    return (
        <Container
            maxWidth="sm"
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                textAlign: 'center',
                gap: '1.5rem',
            }}
        >
            <Icon sx={{fontSize: 100}}>
                <ScreenLockPortraitIcon sx={{fontSize: 'inherit'}}/>
            </Icon>
            <Typography variant="h4" component="h1" gutterBottom>
                Activar autenticación Multifactor
            </Typography>
            <Typography variant="body1" component="p">
                Tu cuenta no tiene la autenticación multifactor activada.
                ¿Deseas activar la autenticación multifactor para aumentar la seguridad de tu cuenta?
            </Typography>
            <Box display="flex" gap="1rem">
                <Button variant="contained" color="primary" onClick={handleNavigateEnable}>
                    ACEPTAR
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleLogout}>
                    REGRESAR
                </Button>
            </Box>
            <Typography variant="body2" component="p" color="textSecondary" style={{marginTop: '2rem'}}>
                Al activar la autenticación multifactor, recibirás instrucciones para configurar tu segundo método de
                verificación.
            </Typography>
        </Container>
    );
};

export default SetupMFA;

// SetupMFA