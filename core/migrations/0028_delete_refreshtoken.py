# Generated by Django 5.0.2 on 2024-02-13 10:30

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0027_alter_userpasskeys_credential_id_and_more'),
    ]

    operations = [
        migrations.DeleteModel(
            name='RefreshToken',
        ),
    ]