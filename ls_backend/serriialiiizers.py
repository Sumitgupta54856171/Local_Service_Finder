from rest_framework import serializers
from .models import User,Servicer

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role', 'crerated_at']


class ServicerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servicer
        fields = '__all__'