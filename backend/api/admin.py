from django.contrib import admin
from api.models import Exercise, Workout, Set, WorkoutPlan


class ExerciseAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'muscle_group', 'description']
    search_fields = ['name', 'muscle_group']
    list_filter = ['muscle_group']


class SetAdmin(admin.ModelAdmin):
    list_display = ['id', 'exercise', 'repetitions', 'weight', 'workout']
    search_fields = ['exercise__name', 'workout__id']
    list_filter = ['exercise', 'workout']


class WorkoutAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'date']
    search_fields = ['user__username', 'date']
    list_filter = ['date', 'user']


class WorkoutPlanAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'exercise', 'start_date', 'frequency_days', 'is_active']
    search_fields = ['user__username', 'exercise__name']
    list_filter = ['is_active', 'start_date', 'frequency_days', 'user']
    
    def get_queryset(self, request):
        # Администратор видит только свои планы (если не суперпользователь)
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(user=request.user)
    
    def save_model(self, request, obj, form, change):
        # Убеждаемся, что план создается для текущего пользователя
        if not change:  # Если это создание нового объекта
            obj.user = request.user
        super().save_model(request, obj, form, change)


admin.site.register(Exercise, ExerciseAdmin)
admin.site.register(Set, SetAdmin)
admin.site.register(Workout, WorkoutAdmin)
admin.site.register(WorkoutPlan, WorkoutPlanAdmin)
