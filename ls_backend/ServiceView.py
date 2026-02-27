
from django.db import DataError
from rest_framework import viewsets, status
from rest_framework.views import APIView

from .models import Servicer
from .serriialiiizers import ServicerSerializer
from .utils import exception_handler
from rest_framework.response import Response
from django.contrib.gis.geos import Point
import csv
from rest_framework.permissions import IsAuthenticated
from .utils.authentication import CookieJWTAuthentication
from .permission import IsAdmin


class ServiceViewSet(viewsets.ModelViewSet):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated,IsAdmin]
    queryset = Servicer.objects.all()
    serializer_class = ServicerSerializer
    def create(self, request, *args, **kwargs):
        try:
            print(request.data)
            serializer = self.get_serializer(data=request.data)
            if (serializer.is_valid()):
                print(serializer.validated_data)
                self.perform_create(serializer)
                print(serializer.data)
                headers = self.get_success_headers(serializer.data)
                return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return exception_handler.custom_exception_handler(e,self)



    def update(self, request, *args, **kwargs):
        try:
            print(request.data)
            instance = self.get_object()
            
            serializer = self.get_serializer(instance, data=request.data, partial=True)
           
            if serializer.is_valid():
                
                self.perform_update(serializer)
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return exception_handler.custom_exception_handler(e, self)




    def destroy(self,request,*args,**kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def bulkupload(self, request, *args, **kwargs):
        try:
            csv_file = request.FILES.get('file')
            print("CSV File:", csv_file)
            if not csv_file:
                return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)
            
            if not csv_file.name.endswith('.csv'):
                return Response({"error": "File is not a CSV"}, status=status.HTTP_400_BAD_REQUEST)

            decoded_file = csv_file.read().decode('utf-8').splitlines()
            reader = csv.DictReader(decoded_file)
            
            services_to_create = []
            for row in reader:
                try:
                   
                    name = row.get('name')
                    category = row.get('category')
                    lat = row.get('latitude')
                    lng = row.get('longitude')
                    rating = row.get('rating')

                    location = None
                    if lat and lng:
                        location = Point(float(lng), float(lat), srid=4326)
                    
                    services_to_create.append(Servicer(
                        name=name,
                        category=category,
                        location=location,
                        rating=float(rating) if rating else None
                    ))
                except (ValueError, TypeError) as e:
                    print(f"Skipping row due to error: {e}")
                    continue
            
            if services_to_create:
                Servicer.objects.bulk_create(services_to_create)
                return Response({"message": f"Successfully uploaded {len(services_to_create)} services"}, status=status.HTTP_201_CREATED)
            
            return Response({"error": "No valid data found in CSV"}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return exception_handler.custom_exception_handler(e, self)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
 
    def limited_list(self, request, *args, **kwargs):
        limit = request.query_params.get('limit') or kwargs.get('limit') or 10
        skip = request.query_params.get('skip') or kwargs.get('skip') or 0

        try:
            limit = int(limit)
            skip = int(skip)
        except ValueError:
            limit = 10
            skip = 0

        queryset = self.filter_queryset(self.get_queryset())[skip:skip + limit]
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


    def searchbyname(self,request,*args,**kwargs):
        name = request.query_params.get('name') or kwargs.get('name')
        queryset = self.filter_queryset(self.get_queryset()).filter(name__icontains=name)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)



    def delete(self,request,*args,**kwargs):
        id = request.query_params.get('id') or kwargs.get('id')
        print(id)
        queryset = self.filter_queryset(self.get_queryset()).filter(id=id)
        queryset.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


