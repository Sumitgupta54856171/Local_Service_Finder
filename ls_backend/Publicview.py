from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D
from django.contrib.gis.db.models.functions import Distance
from .serriialiiizers import ServicerSerializer
from .models import Servicer

class PublicServiceViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Public API to list and search nearby services.
    - Read-Only (Safe)
    - Rate Limited (Protected)
    - Geo-Spatial Search (Radius & Distance)
    """
    permission_classes = [permissions.AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'public_api'
    serializer_class = ServicerSerializer
    
    def get_queryset(self):
        # Base queryset
        queryset = Servicer.objects.all()

        # Get spatial and filter inputs from the request
        lat = self.request.query_params.get('lat')
        lng = self.request.query_params.get('lng')
        radius = self.request.query_params.get('radius')  # in km
        category = self.request.query_params.get('category')  # Category Filtering

        # Category Filter apply karein
        if category:
            queryset = queryset.filter(category__iexact=category)

        # GeoQuery Logic (Spatial Operations)
        if lat and lng and radius:
            try:
                # Create a spatial Point object (Longitude pehle, Latitude baad mein)
                user_location = Point(float(lng), float(lat), srid=4326)
                radius_km = float(radius)

                # A) Radius Search: Sirf wahi services layein jo radius ke andar hain
                queryset = queryset.filter(location__distance_lte=(user_location, D(km=radius_km)))

                # B) Distance Calculation: Har service ka user se distance calculate karein
                queryset = queryset.annotate(distance=Distance('location', user_location))

                # C) Sorting: Sabse pass wali service pehle dikhayein (Nearest distance)
                queryset = queryset.order_by('distance')

            except ValueError:
                # Agar user ne galat lat/lng string bhej di, toh safely handle karein
                pass
        else:
            # Agar lat/lng nahi hai (default map view), toh latest services dikhayein
            queryset = queryset.order_by('-created_at')

        return queryset

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

    def detailpage(self, request,*args, **kwargs):
        id =request.query_params.get('id') or kwargs.get('id')
        print(id)
        queryset = self.filter_queryset(self.get_queryset()).filter(id=id)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)



