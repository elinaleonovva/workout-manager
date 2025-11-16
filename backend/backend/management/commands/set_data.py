from django.core.management.base import BaseCommand
from api.models import Exercise


class Command(BaseCommand):
    help = 'Добавляет 10 примерных упражнений в базу данных'

    def handle(self, *args, **kwargs):
        exercises = [
            {
                'name': 'Жим лёжа',
                'muscle_group': 'Грудные мышцы',
                'description': 'Базовое упражнение для развития грудных мышц, плеч и трицепсов.'
            },
            {
                'name': 'Приседания со штангой',
                'muscle_group': 'Ноги',
                'description': 'Развивает квадрицепсы, ягодицы и заднюю поверхность бедра.'
            },
            {
                'name': 'Становая тяга',
                'muscle_group': 'Спина',
                'description': 'Упражнение для всей задней цепи мышц: спина, ягодицы, ноги.'
            },
            {
                'name': 'Жим штанги стоя',
                'muscle_group': 'Плечи',
                'description': 'Развивает дельтовидные мышцы и трицепсы.'
            },
            {
                'name': 'Подтягивания',
                'muscle_group': 'Спина',
                'description': 'Работают широчайшие мышцы спины и бицепсы.'
            },
            {
                'name': 'Тяга штанги в наклоне',
                'muscle_group': 'Спина',
                'description': 'Укрепляет среднюю часть спины и задние дельты.'
            },
            {
                'name': 'Сгибание рук на бицепс',
                'muscle_group': 'Руки',
                'description': 'Изолированное упражнение для развития бицепсов.'
            },
            {
                'name': 'Разгибание рук на трицепс',
                'muscle_group': 'Руки',
                'description': 'Изолированное упражнение для развития трицепсов.'
            },
            {
                'name': 'Выпады с гантелями',
                'muscle_group': 'Ноги',
                'description': 'Отлично развивают ягодицы, квадрицепсы и баланс.'
            },
            {
                'name': 'Планка',
                'muscle_group': 'Пресс',
                'description': 'Изометрическое упражнение для укрепления мышц кора.'
            }
        ]

        for ex in exercises:
            obj, created = Exercise.objects.get_or_create(name=ex['name'], defaults=ex)
            if created:
                self.stdout.write(self.style.SUCCESS(f"Добавлено упражнение: {ex['name']}"))
            else:
                self.stdout.write(self.style.WARNING(f"Упражнение уже существует: {ex['name']}"))
