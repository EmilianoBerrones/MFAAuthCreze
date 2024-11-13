import {useState} from "react";
import api from "../api.js"
import {useNavigate} from "react-router-dom";
import {TEMP_TOKEN} from "../constants.js";
import { TextField, Button, Typography, Container, Box } from '@mui/material';

function Form({route, method}) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    const name = method === "login" ? "Iniciar sesión" : "Registrarse"

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            const res = await api.post(route, {username, password})
            if (method === "login") {
                // CHECAR SI EL USUARIO TIENE 2FA ACTIVADO Y REDIRECCIONAR
                if (res.data.detail === '2FA required') {
                    navigate('/MFALogin')
                }
                if (res.data.detail === '2FA device not found') {
                    localStorage.setItem(TEMP_TOKEN, res.data.temp)
                    navigate('/MFASetup')
                }
            } else {
                navigate("/login")
            }
        } catch (error) {
            alert(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Container
            maxWidth="xs"
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
            }}
        >
            <form onSubmit={handleSubmit} style={{width: '100%'}}>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    {name}
                </Typography>
                <Box display="flex" flexDirection="column" gap="1rem" mb={3}>
                    <TextField
                        label="Usuario"
                        variant="outlined"
                        fullWidth
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        label="Contraseña"
                        type="password"
                        variant="outlined"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    fullWidth
                    onClick={handleSubmit}
                    size="large"
                >
                    {name}
                </Button>
            </form>
        </Container>
    );
}

export default Form