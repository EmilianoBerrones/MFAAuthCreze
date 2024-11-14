import {Container, Box, Button} from '@mui/material';
import {useNavigate} from "react-router-dom";

const EnableMFA = () => {
    const navigate = useNavigate();

    const handleNavigateLogin = () => {
        navigate('/login');
    }

    return (
        <Container
            maxWidth="sm"
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
            }}
        >
            <Box
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                }}
            >
                <iframe
                    src="http://localhost:8000/account/two_factor/setup/"
                    title="QR Code for 2FA"
                    style={{
                        width: '100%',
                        height: '90vh',
                        border: 'none',
                    }}
                />
                <Button onClick={handleNavigateLogin} fullWidth>
                    Iniciar sesión con OTP.
                </Button>
            </Box>
        </Container>
    );
};

export default EnableMFA;
