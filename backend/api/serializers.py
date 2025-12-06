from rest_framework import serializers
from api.models import Exercise, Workout, Set, WorkoutPlan


class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ['id', 'name', 'muscle_group', 'description', 'equipment', 'technique']


class SetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Set
        fields = ['id', 'exercise', 'repetitions', 'weight']


class WorkoutSerializer(serializers.ModelSerializer):
    sets = SetSerializer(many=True)
    muscles_involved = serializers.SerializerMethodField()

    class Meta:
        model = Workout
        fields = ['id', 'user', 'sets', 'date', 'name', 'muscles_involved']
        read_only_fields = ["user"]

    def get_muscles_involved(self, obj):
        muscles = set()
        for s in obj.sets.all():
            muscles.add(s.exercise.muscle_group)
        return list(muscles)

    def create(self, validated_data):
        sets_data = validated_data.pop('sets')
        validated_data["user"] = self.context["request"].user

        workout = Workout.objects.create(**validated_data)
        if sets_data:
            for set_data in sets_data:
                Set.objects.create(workout=workout, **set_data)

        return workout

    def update(self, instance, validated_data):
        sets_data = validated_data.pop('sets', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if sets_data:
            for set_data in sets_data:
                Set.objects.create(workout=instance, **set_data)
        return instance


class WorkoutPlanSerializer(serializers.ModelSerializer):
    exercise_name = serializers.CharField(source='exercise.name', read_only=True)
    exercise_muscle_group = serializers.CharField(source='exercise.muscle_group', read_only=True)
    next_dates = serializers.SerializerMethodField()

    class Meta:
        model = WorkoutPlan
        fields = ['id', 'user', 'exercise', 'exercise_name', 'exercise_muscle_group', 
                  'start_date', 'frequency_days', 'is_active', 'created_at', 'next_dates']
        read_only_fields = ['user', 'created_at']

    def get_next_dates(self, obj):
        """Возвращает следующие даты тренировок (максимум на 1 год вперед)"""
        return [date.strftime('%Y-%m-%d') for date in obj.get_next_dates(400)]

    def create(self, validated_data):
        # Убеждаемся, что план создается для текущего пользователя
        user = self.context['request'].user
        validated_data['user'] = user
        
        exercise = validated_data.get('exercise')
        
        # Проверяем, существует ли уже план для этого упражнения у этого пользователя
        existing_plan = WorkoutPlan.objects.filter(user=user, exercise=exercise).first()
        
        if existing_plan:
            # Если план существует, обновляем его вместо создания нового
            existing_plan.start_date = validated_data.get('start_date', existing_plan.start_date)
            existing_plan.frequency_days = validated_data.get('frequency_days', existing_plan.frequency_days)
            existing_plan.is_active = validated_data.get('is_active', True)
            existing_plan.save()
            return existing_plan
        
        # Создаем новый план
        return super().create(validated_data)
