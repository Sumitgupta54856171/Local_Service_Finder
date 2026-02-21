from django.urls import path,include
from .views import UserViewSet
from rest_framework.routers import DefaultRouter
from .ServiceView import ServiceViewSet
from rest_framework_simplejwt.views import (
    token_obtain_pair,
    TokenRefreshView,
)

router = DefaultRouter()
router.register('users',UserViewSet,basename='users')

urlpatterns = [
    path('api/login/', UserViewSet.as_view({'post':'auth'}), name='login'),
    path('api/v1/',ServiceViewSet.as_view({'post':'create','patch':'update'})),
    path('api/',include(router.urls)),
    path('api/token/refresh/',TokenRefreshView.as_view(),name = 'token_refresh'),
]