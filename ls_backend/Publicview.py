from rest_framework import viewsets

from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D
from .models import Servicer
from .serriialiiizers import ServicerSerializer
from django.contrib.gis.db.models.functions import Distance
from django.core.cache import cache
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

class PublicServiceViewSet(viewsets.ReadOnlyModelViewSet):
 permission_classes = [AllowAny]
 authentication_classes = []  # No authentication for public view
 queryset = Servicer.objects.all()
 serializer_class = ServicerSerializer


 def get_queryset(self):
 
  try:
    
    queryset = Servicer.objects.all()
    request = self.request

    # Get spatial and filter inputs from the request
    lat = request.query_params.get('lat')
    lng = request.query_params.get('lng') 
    radius = request.query_params.get('radius')  
    category = request.query_params.get('category') 


    if category:
        queryset = queryset.filter(category__icontains=category)

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

        except ValueError:
           pass
    else:
        # Agar lat/lng nahi hai (default map view), toh latest services dikhayein
        queryset = queryset.order_by('-created_at')
        
     
    return queryset
  except Exception as e:
      print(e)
      return Servicer.objects.none()



 def list(self, request, *args, **kwargs):
    queryset = self.filter_queryset(self.get_queryset())
    
    page = self.paginate_queryset(queryset)
    if page is not None:
        serializer = self.get_serializer(page, many=True)
        return self.get_paginated_response(serializer.data)

    serializer = self.get_serializer(queryset, many=True)
    return Response(serializer.data)


 def limited_list(self, request, *args, **kwargs):
    limit = request.query_params.get('limit') or kwargs.get('limit') or 10
    skip = request.query_params.get('skip') or kwargs.get('skip') or 0
    print(f"Limit: {limit}, Skip: {skip}")
    try:
        limit = int(limit)
        skip = int(skip)
        cache_key = f'services_{skip}_{limit}'
        cached_data = cache.get(cache_key)
        if cached_data:
            return Response(cached_data)
    except ValueError:
        limit = 10
        skip = 0

    queryset = self.filter_queryset(self.get_queryset())[skip:skip + limit]
    serializer = self.get_serializer(queryset, many=True)
    cache.set(f'services_{skip}_{limit}', serializer.data, timeout=300)  
    return Response(serializer.data)


 def detailpage(self, request, *args, **kwargs):
    id = request.query_params.get('id') or kwargs.get('id')
    
    queryset = self.filter_queryset(self.get_queryset()).filter(id=id)
    serializer = self.get_serializer(queryset, many=True)
    return Response(serializer.data)