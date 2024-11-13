"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# backend/backend/urls.py
from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView, InitiateLoginView, Verify2FAView
from rest_framework_simplejwt.views import TokenRefreshView
from two_factor.urls import urlpatterns as tf_urls

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user/register/', CreateUserView.as_view(), name='register'),
    path('api/token/initiate_login/', InitiateLoginView.as_view(), name='initiate_login'),  # Inicio de sesión inicial
    path('api/token/verify_2fa/', Verify2FAView.as_view(), name='verify_2fa'),  # Verificación de 2FA y emisión de JWT
    path('api/token/refresh/', TokenRefreshView.as_view(), name='refresh'),  # Refrescar JWT
    path('api-auth/', include('rest_framework.urls')),
    path('', include(tf_urls)),  # URLs de 2FA de django-two-factor-auth
]

