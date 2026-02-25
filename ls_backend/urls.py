from django.urls import path, include
from .views import UserViewSet
from rest_framework.routers import DefaultRouter
from .ServiceView import ServiceViewSet
from .Publicview import PublicServiceViewSet
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework_simplejwt.views import (
    TokenObtainPairView,  # ← added (you imported but didn't use)
    TokenRefreshView,
)

schema_view = get_schema_view(
    openapi.Info(
        title="Service API",
        default_version='v1',
        description="Service Management API Documentation",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    # Documentation first — good practice
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/',   schema_view.with_ui('redoc',   cache_timeout=0), name='schema-redoc'),

    # Auth
    path('api/login/',UserViewSet.as_view({'post': 'checkuser'}), name='login'),

    path('api/token/refresh/',  TokenRefreshView.as_view(),       name='token_refresh'),
    # path('api/token/',       TokenObtainPairView.as_view(),     name='token_obtain_pair'),  # ← optional, if you want /token/

    # ──────────────────────────────────────────────────────────────
    #  SERVICE – private / authenticated endpoints
    # ──────────────────────────────────────────────────────────────
    path('api/service/bulkupload', 
         ServiceViewSet.as_view({'post': 'bulkupload'}), 
         name='servicebulkupload'),

    path('api/service/create', 
         ServiceViewSet.as_view({'post': 'create'}), 
         name='servicecreate'),

    path('api/service/update/<int:pk>',
         ServiceViewSet.as_view({'put': 'update', 'patch': 'update'}),  # ← support both PUT and PATCH
         name='serviceupdate'),

    path('api/service/delete/<int:pk>',     # ← more explicit
         ServiceViewSet.as_view({'delete': 'destroy'}),  # ← use 'destroy' (standard)
         name='servicedelete'),

    # Important: longer/more-specific paths FIRST
    path('api/service/<int:limit>/<int:skip>/', 
         ServiceViewSet.as_view({'get': 'limited_list'}), 
         name='service-limited'),

   

    # ──────────────────────────────────────────────────────────────
    #  PUBLIC – unauthenticated endpoints
    # ──────────────────────────────────────────────────────────────
    path('api/public/search/nearby/', 
         PublicServiceViewSet.as_view({'get': 'list'}),   # ← rename action to 'nearby' if possible
         name='publicservicesearch'),
    path('api/public/search/',
         PublicServiceViewSet.as_view({'get': 'list'}), 
         name='publicservicesearch-list'),

    path('api/public/<int:id>/', 
         PublicServiceViewSet.as_view({'get': 'detailpage'}), 
         name='servicedetail'),

    path('api/public/<int:limit>/<int:skip>/', 
         PublicServiceViewSet.as_view({'get': 'limited_list'}), 
         name='publicservice-limited'),

    path('api/public/', 
         PublicServiceViewSet.as_view({'get': 'list'}), 
         name='publicservice'),
]