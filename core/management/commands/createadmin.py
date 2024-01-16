from django.core.management.base import BaseCommand
from core.models import User
from onroad.settings import ADMIN_PASSWORD


class Command(BaseCommand):
    help = "Create or update a superuser with a password from the environment variable ADMIN_PASSWORD"

    def handle(self, *args, **options):
        # Get the ADMIN_PASSWORD from the environment variable
        admin_password = ADMIN_PASSWORD

        if not admin_password:
            self.stdout.write(
                self.style.ERROR("ADMIN_PASSWORD environment variable is not set.")
            )
            return

        # Create or update the superuser using update_or_create
        custom_user, created = User.objects.update_or_create(
            username="admin",
            defaults={
                "email": "admin@example.com",
                "is_superuser": True,
                "is_staff": True,
                "is_active": True,
                "first_name": "Onroad",
                "last_name": "Admin",
            },
        )

        # Update the password in any case
        custom_user.set_password(admin_password)
        custom_user.save()

        if created:
            self.stdout.write(self.style.SUCCESS("Superuser created successfully."))
        else:
            self.stdout.write(self.style.SUCCESS("Superuser updated successfully."))
