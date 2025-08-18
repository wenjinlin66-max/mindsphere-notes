from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NoteViewSet, TagViewSet

# 创建一个路由器并注册我们的视图集
router = DefaultRouter()
router.register(r'notes', NoteViewSet, basename='note')
router.register(r'tags', TagViewSet, basename='tag')

# API URL由路由器自动确定
urlpatterns = [
    path('', include(router.urls)),
]