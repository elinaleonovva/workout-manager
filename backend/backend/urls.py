from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import ExerciseViewSet, WorkoutViewSet, WorkoutPlanViewSet, is_admin_view
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

# DRF роутер
router = DefaultRouter()
router.register('exercises', ExerciseViewSet, basename='exercise')
router.register('workouts', WorkoutViewSet, basename='workout')
router.register('workout-plans', WorkoutPlanViewSet, basename='workout-plan')

urlpatterns = [
    path('admin/', admin.site.urls),

    # Djoser эндпоинты для авторизации
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),

    # Простой эндпоинт
    path('is_admin/', is_admin_view),

    # DRF роутер
    path('', include(router.urls)),

    # drf-spectacular схема и UI
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/swagger/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]
