from django.urls import path
from .views import UserViewSet
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    token_obtain_pair,
    token_refresh, TokenRefreshView,
)

router = DefaultRouter()
router.register('users',UserViewSet,basename='users')

urlpatterns = [
     path('api/login/', UserViewSet.view_name, name='name'),
     path('api/token/refresh/',TokenRefreshView.as_view(),name = 'token_refresh'),
]