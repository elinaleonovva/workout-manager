# Generated manually

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_workout_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='exercise',
            name='equipment',
            field=models.CharField(blank=True, help_text='Требуемый инвентарь', max_length=200),
        ),
        migrations.AddField(
            model_name='exercise',
            name='technique',
            field=models.TextField(blank=True, help_text='Техника выполнения'),
        ),
    ]

