
from django.db import DataError
from rest_framework import viewsets, status
from rest_framework.decorators import permission_classes

from .models import Servicer
from .serriialiiizers import ServicerSerializer
from .utils import exception_handler
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,AllowAny


class ServiceViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Servicer.objects.all()
    serializer_class = ServicerSerializer
    def create(self, request, *args, **kwargs):

        try:
            serializer = self.get_serializer(data=request.data)
            if (serializer.is_valid()):
                self.perform_create(serializer)
                headers = self.get_success_headers(serializer.data)
                return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except DataError as e:

            return Response({"error":e.args[0]},status=status.HTTP_400_BAD_REQUEST)
        except ValueError as e:
            return Response({"error":e.args[0]},status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return exception_handler.custom_exception_handler(e,self)

    def update(self, request, *args, **kwargs):
        try:
            partial = kwargs.pop('partial', False)
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)
        except DataError as e:
            return Response({"error": e.args[0]}, status=status.HTTP_400_BAD_REQUEST)
        except ValueError as e:
            return Response({"error": e.args[0]}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return exception_handler.custom_exception_handler(e, self)

    def retrieve(self, request, *args, **kwargs):


     def destroy(self,request,*args,**kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)





