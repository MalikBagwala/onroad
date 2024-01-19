# Generated by Django 5.0.1 on 2024-01-19 16:20

import core.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0005_alter_attachment_created_by'),
    ]

    operations = [
        migrations.AddField(
            model_name='attachment',
            name='height',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='attachment',
            name='width',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='attachment',
            name='file',
            field=models.ImageField(height_field='height', upload_to=core.models.custom_filename, width_field='width'),
        ),
    ]
