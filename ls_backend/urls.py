from django.urls import path,include
from .views import UserViewSet, LoginView
from rest_framework.routers import DefaultRouter
from .ServiceView import ServiceViewSet
from .Publicview import PublicServiceViewSet
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework_simplejwt.views import (
    token_obtain_pair,
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

router = DefaultRouter()
router.register('users',UserViewSet,basename='users')
router.register('service', ServiceViewSet, basename='service')
router.register('public',   PublicServiceViewSet  , basename='publicservice')


urlpatterns = [
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('api/login', LoginView.as_view(),name='login'),
    path('api/service/delete/<int:id>',ServiceViewSet.as_view({'delete':'delete'}),name='servicedelete'),
    path('api/service/bulkupload', ServiceViewSet.as_view({'post': 'bulkupload'}), name='servicebulkupload'),
    path('api/public', PublicServiceViewSet.as_view({'get':'list'}),name='publicservice'),
    path('api/public/<int:limit>/<int:skip>',PublicServiceViewSet.as_view({'get':'limited_list'}),name='publicservice'),
    path('api/service/<int:limit>/<int:skip>',ServiceViewSet.as_view({'get':'limited_list'}),name='service'),
    path('api/service',ServiceViewSet.as_view({'get':'list'}),name='service'),
    path('api/public/<int:id>',PublicServiceViewSet.as_view({'get':'detailpage'}),name='servicedetail'),
    path('api/service/update/<int:pk>',ServiceViewSet.as_view({'put':'update'}),name='serviceupdate'),
    path('api/service/create',ServiceViewSet.as_view({'post':'create'}),name='servicecreate'),
    path('api/service/bulkupload', ServiceViewSet.as_view({'post': 'bulkupload'}), name='servicebulkupload'),
    path('api/v1/',include(router.urls)),
    path('api/token/refresh/',TokenRefreshView.as_view(),name = 'token_refresh'),
]