# Generated by Django 5.0.1 on 2024-02-02 18:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0016_make_code_vehicletype_code'),
    ]

    operations = [
        migrations.AlterField(
            model_name='make',
            name='code',
            field=models.CharField(blank=True, max_length=3, null=True),
        ),
        migrations.AlterField(
            model_name='vehicletype',
            name='code',
            field=models.CharField(blank=True, max_length=3, null=True),
        ),
    ]