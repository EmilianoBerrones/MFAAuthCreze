import React, {useState} from 'react';
import {Container, TextField, Button, Box, Typography} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import api from '../api.js';

function MFALogin() {
    const [otpCode, setOtpCode] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Maneja el cambio de input
    const handleChange = (event) => {
        setOtpCode(event.target.value);
    };

    // Función para manejar el envío del formulario
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const data = {otp_code: otpCode};
            console.log(data);
            // Habilita el envío de cookies con la solicitud
            const response = await api.post('/api/token/verify_2fa/', data, {
                withCredentials: true,
            });

            console.log("Respuesta de la API:", response.data);

            if (response.data.detail === 'Invalid OTP code') {
                setError('Código OTP inválido. Inténtalo de nuevo.');
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            console.error("Error al verificar el código OTP:", error.response ? error.response.data : error.message);
            setError('Ocurrió un error al verificar el código. Intenta nuevamente.');
        }
    };


    return (
        <Container maxWidth="xs">
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    mt: 5,
                }}
            >
                <Typography variant="h5" component="h1">
                    Ingreso de OTP
                </Typography>

                <TextField
                    label="Código OTP"
                    variant="outlined"
                    fullWidth
                    value={otpCode}
                    onChange={handleChange}
                    error={Boolean(error)}
                    helperText={error}
                />

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                >
                    Verificar
                </Button>
            </Box>
        </Container>
    );
}

export default MFALogin;
