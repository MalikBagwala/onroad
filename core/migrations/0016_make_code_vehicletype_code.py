# Generated by Django 5.0.1 on 2024-02-02 18:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0015_alter_variant_slug'),
    ]

    operations = [
        migrations.AddField(
            model_name='make',
            name='code',
            field=models.CharField(default='', max_length=3),
        ),
        migrations.AddField(
            model_name='vehicletype',
            name='code',
            field=models.CharField(default='', max_length=3),
        ),
    ]
