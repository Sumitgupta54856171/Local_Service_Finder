from http.client import responses

from django.core.serializers import serialize
from django.db import DataError
from django.shortcuts import render
from rest_framework import viewsets, status
from .models import User
from .serriialiiizers import UserSerializer,ServicerSerializer
from .utils import exception_handler
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken



from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

class LoginView(APIView):
    authentication_classes = []
    permission_classes = []


    def post(self, request):
        try:
            email = request.data.get('email')
            password = request.data.get('password')
            if email and password:
                try:
                    user = User.objects.get(email=email)
                except User.DoesNotExist:
                    return Response({"error": "User does not exist"}, status=status.HTTP_400_BAD_REQUEST)
                
                from django.contrib.auth.hashers import check_password
                if check_password(password, user.password):
                    refresh = RefreshToken.for_user(user)
                    access_token = str(refresh.access_token)
                    refresh_token = str(refresh)
                    response = Response(
                        {
                            "user": UserSerializer(user).data,
                            "message": "Login successful"
                        },
                        status=status.HTTP_200_OK
                    )

                    response.set_cookie(
                        key='access_token',
                        value=access_token,
                        httponly=True,
                        secure=False,
                        samesite="Lax"
                    )

                    response.set_cookie(
                        key='refresh_token',
                        value=refresh_token,
                        httponly=True,
                        secure=False,
                        samesite="Lax"
                    )


                    return Response({
                        "user": UserSerializer(user).data,
                        "access": str(refresh.access_token),
                    }, status=status.HTTP_200_OK)



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

class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserSerializer







