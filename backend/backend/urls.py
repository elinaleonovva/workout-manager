from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import ExerciseViewSet, WorkoutViewSet, WorkoutPlanViewSet, is_admin_view

router = DefaultRouter()
router.register('exercises', ExerciseViewSet, basename='exercise')
router.register('workouts', WorkoutViewSet, basename='workout')
router.register('workout-plans', WorkoutPlanViewSet, basename='workout-plan')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path('is_admin/', is_admin_view),
    path('', include(router.urls)),
]
