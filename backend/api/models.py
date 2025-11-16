from django.contrib.auth.models import User
from django.db import models


class Exercise(models.Model):
    name = models.CharField(max_length=100, unique=True)
    muscle_group = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Workout(models.Model):
    name = models.CharField(max_length=30, blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='workouts')
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"Workout {self.id} by {self.user.username}"


class Set(models.Model):
    workout = models.ForeignKey(Workout, on_delete=models.CASCADE, related_name='sets')
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE, related_name='sets')
    repetitions = models.IntegerField()
    weight = models.FloatField()

    def __str__(self):
        return f"{self.repetitions} x {self.weight}kg - {self.exercise.name}"


class WorkoutPlan(models.Model):
    """План тренировок с периодичностью"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='workout_plans')
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE, related_name='workout_plans')
    start_date = models.DateField()
    frequency_days = models.IntegerField(default=1, help_text="Количество дней между тренировками")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'exercise']
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.exercise.name} - каждые {self.frequency_days} дней для {self.user.username}"

    def get_next_dates(self, count=10):
        """Возвращает список следующих дат тренировок (максимум на 1 год вперед)"""
        from datetime import timedelta
        dates = []
        current_date = self.start_date
        end_date = self.start_date + timedelta(days=365)  # Максимум 1 год
        
        while len(dates) < count and current_date <= end_date:
            if current_date >= self.start_date:
                dates.append(current_date)
            current_date += timedelta(days=self.frequency_days)
        return dates
