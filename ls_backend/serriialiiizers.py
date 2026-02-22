from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer, GeometryField
from .models import User,Servicer

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role', 'created_at']


class ServicerSerializer(serializers.ModelSerializer):
    location = GeometryField()
    class Meta:
        model = Servicer
        fields = '__all__'