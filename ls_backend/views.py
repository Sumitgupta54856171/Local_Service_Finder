from http.client import responses

from django.core.serializers import serialize
from django.db import DataError
from django.shortcuts import render
from rest_framework import viewsets, status
from .models import User
from .serriialiiizers import UserSerializer
from .utils import exception_handler
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password, make_password


from rest_framework.permissions import AllowAny
from rest_framework.views import APIView

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer



    def checkuser(self, request):
        try:
            email = request.data.get('email')
            password = request.data.get('password')
            print(f"Login attempt with email: {email}")
            if email and password:
                try:
                    user = User.objects.get(email=email)
                except User.DoesNotExist:
                    return Response({"error": "User does not exist"}, status=status.HTTP_400_BAD_REQUEST)
                
                password_valid = check_password(password, user.password)
                if not password_valid and user.password == password:
                    # Legacy plaintext passwords may exist in the DB; rehash on first successful login.
                    user.password = make_password(password)
                    user.save(update_fields=['password'])
                    password_valid = True

                if password_valid:
                    refresh = RefreshToken.for_user(user)
                    access_token = str(refresh.access_token)
                    
                    refresh_token = str(refresh)
                    print(refresh_token)
                    response = Response(
                        {
                            "user": UserSerializer(user).data,
                            "message": "Login successful",
                            "access": access_token,
                            "refresh": refresh_token
                        },
                        status=status.HTTP_200_OK
                    )

                    response.set_cookie(
                        key='accessToken',
                        value=access_token,
                        httponly=True,
                        secure=False,
                        samesite="Lax"
                    )

                    response.set_cookie(
                        key='refreshToken',
                        value=refresh_token,
                        httponly=True,
                        secure=False,
                        samesite="Lax"
                    )

                    return response
                else:
                    return Response({"error": "Invalid password"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"error": "Invalid email and password"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return exception_handler.custom_exception_handler(e, self)

    def postlogout(self, request):
        response = Response({"message": "logged out"})
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        return response








