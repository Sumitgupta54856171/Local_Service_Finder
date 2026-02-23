from prompt_toolkit.key_binding.bindings.named_commands import uppercase_word
from rest_framework import viewsets, status
from rest_framework.decorators import permission_classes
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D
from .models import Servicer
from .serriialiiizers import ServicerSerializer
from django.contrib.gis.db.models.functions import Distance
from .utils import exception_handler
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.exceptions import ValidationError

class PublicServiceViewSet(viewsets.ModelViewSet):
 queryset = Servicer.objects.all()
 serializer_class = ServicerSerializer
 permission_classes = [AllowAny]


 def get_queryset(self, *args, **kwargs):
  try:
    # Base queryset
    queryset = Servicer.objects.all()
    print("start")


    # Get spatial and filter inputs from the request
    lat = self.request.query_params.get('lat') or kwargs.get('lat')
    lng = self.request.query_params.get('lng') or kwargs.get('lng')
    radius = self.request.query_params.get('radius') or kwargs.get('radius') # in km
    category = self.request.query_params.get('category') or kwargs.get('category')
    print(category)# Category Filtering

    # Category Filter apply karein
    if category:
        queryset = queryset.filter(category__icontains="atm")

        print("SQL:", queryset.query)
        print("SQL COUNT:", queryset.count())



    # GeoQuery Logic (Spatial Operations)
    if lat and lng and radius:
        try:
            # Create a spatial Point object (Longitude pehle, Latitude baad mein)
            user_location = Point(float(lng), float(lat), srid=4326)
            radius_km = float(radius)
            queryset = queryset.filter(location__distance_lte=(user_location, D(km=radius_km)))

            # B) Distance Calculation: Har service ka user se distance calculate karein
            queryset = queryset.annotate(distance=Distance('location', user_location))

            # C) Sorting: Sabse pass wali service pehle dikhayein (Nearest distance)
            queryset = queryset.order_by('distance')

            
            print(queryset.query)
            print(queryset.count())
            print("SQL COUNT:", queryset.values())


        except ValueError:
           pass
    else:
        # Agar lat/lng nahi hai (default map view), toh latest services dikhayein
        queryset = queryset.order_by('-created_at')
    return queryset
  except Exception as e:
      print(e)
      return Servicer.objects.none()


 @method_decorator(cache_page(60 * 15))
 def list(self, request, *args, **kwargs):
    queryset = self.filter_queryset(self.get_queryset())

    # Handle pagination if configured
    page = self.paginate_queryset(queryset)
    if page is not None:
        serializer = self.get_serializer(page, many=True)
        return self.get_paginated_response(serializer.data)

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


 def detailpage(self, request, *args, **kwargs):
    id = request.query_params.get('id') or kwargs.get('id')
    print(id)
    queryset = self.filter_queryset(self.get_queryset()).filter(id=id)
    serializer = self.get_serializer(queryset, many=True)
    return Response(serializer.data)