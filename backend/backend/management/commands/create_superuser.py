import os
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Create a superuser if it does not exist'

    def handle(self, *args, **kwargs):
        User = get_user_model()
        admin_username = os.getenv("DJANGO_ADMIN_USERNAME", "admin")
        admin_password = os.getenv("DJANGO_ADMIN_PASSWORD", "admin")
        admin_email = os.getenv("DJANGO_ADMIN_EMAIL", "admin@admin.com")

        if not User.objects.filter(username=admin_username).exists():
            User.objects.create_superuser(
                username=admin_username,
                password=admin_password,
                email=admin_email
            )
            self.stdout.write(self.style.SUCCESS(f"Superuser '{admin_username}' created successfully"))
        else:
            self.stdout.write(self.style.WARNING(f"Superuser '{admin_username}' already exists"))
