# backend/api/views.py
from datetime import timedelta
from os import access
from django.shortcuts import render
from django.contrib.auth import authenticate, get_user_model
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from two_factor.utils import default_device
from .serializers import UserSerializer

# Modelo de usuario
User = get_user_model()


# Vista para crear un nuevo usuario
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class TemporaryToken(AccessToken):
    """
    Token personalizado para autenticación temporal durante configuración 2FA
    """
    token_type = "temp"
    lifetime = timedelta(minutes=15)  # Token temporal con vida más corta

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Agregar claims específicos para token temporal
        self['token_type'] = self.token_type


# Vista para iniciar el login, verificando credenciales antes del 2FA
class InitiateLoginView(APIView):
    """
    Vista para iniciar el login. Verifica las credenciales
    y activa el proceso de 2FA sin emitir el token JWT todavía.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)

        if user is not None:
            # Verifica si el usuario tiene un dispositivo 2FA configurado
            if default_device(user):
                request.session['pre_2fa_user_id'] = user.id
                return Response({"detail": "2FA required"}, status=status.HTTP_200_OK)
            else:
                token = TemporaryToken.for_user(user)
                return Response({
                    "temp" : str(token),
                    "detail": "2FA device not found",
                }, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)


# Vista para verificar el código de 2FA y emitir el token JWT
class Verify2FAView(APIView):
    """
    Vista para verificar el código de 2FA y emitir el token JWT
    """
    permission_classes = [AllowAny]

    def post(self, request):
        user_id = request.session.get('pre_2fa_user_id')
        if not user_id:
            return Response({"detail": "2FA initiation not found"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.get(id=user_id)
        code = request.data.get("otp_code")
        device = default_device(user)

        # Verificar el código OTP
        if device.verify_token(code):
            # Emitir el token JWT si el código es correcto
            refreshTkn = RefreshToken.for_user(user)
            accessTkn = AccessToken.for_user(user)
            return Response({
                'refresh': str(refreshTkn),
                'access': str(accessTkn),
            }, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Invalid OTP code"}, status=status.HTTP_400_BAD_REQUEST)


def qr_code_view(request):
    response = render(request, 'Templates/qr_code.html')
    response["Content-Security-Policy"] = "frame-ancestors http://localhost:8000"
    return response
