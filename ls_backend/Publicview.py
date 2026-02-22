from rest_framework import viewsets, status
from rest_framework.decorators import permission_classes

from .models import Servicer
from .serriialiiizers import ServicerSerializer
from .utils import exception_handler
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,AllowAny

class PublicServiceViewSet(viewsets.ModelViewSet):
    queryset = Servicer.objects.all()
    serializer_class = ServicerSerializer
    permission_classes = [AllowAny]  # Public list – no auth required



