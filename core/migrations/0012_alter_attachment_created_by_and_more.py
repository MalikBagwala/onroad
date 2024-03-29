# Generated by Django 5.0.1 on 2024-01-29 09:41

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0011_alter_attachment_url'),
    ]

    operations = [
        migrations.AlterField(
            model_name='attachment',
            name='created_by',
            field=models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='attachment',
            name='mime_type',
            field=models.CharField(blank=True, max_length=50),
        ),
        migrations.AlterField(
            model_name='attachment',
            name='url',
            field=models.URLField(blank=True),
        ),
    ]
