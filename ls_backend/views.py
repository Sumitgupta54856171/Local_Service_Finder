from django.core.serializers import serialize
from django.db import DataError
from django.shortcuts import render
from rest_framework import viewsets, status
from .models import User
from .serriialiiizers import UserSerializer,ServicerSerializer
from .utils import exception_handler
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken



class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def auth(self, request, *args, **kwargs):
        try:
            print(request.data)
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
                    return Response({
                        "user": UserSerializer(user).data,
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                    }, status=status.HTTP_200_OK)
                else:
                    return Response({"error": "Invalid password"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"error": "Invalid email and password"}, status=status.HTTP_400_BAD_REQUEST)

        except DataError as e:
            return Response({"error": e.args[0]}, status=status.HTTP_400_BAD_REQUEST)
        except ValueError as e:
            return Response({"error": e.args[0]}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return exception_handler.custom_exception_handler(e, self)






