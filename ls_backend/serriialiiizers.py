from rest_framework import serializers
from .models import User,Servicer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class ServicerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servicer
        fields = '__all__'