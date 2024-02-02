# Generated by Django 5.0.1 on 2024-02-02 17:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0013_variant_short_description_alter_city_code_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='variant',
            name='slug',
            field=models.CharField(default='', editable=False, max_length=255),
        ),
        migrations.AlterField(
            model_name='variant',
            name='name',
            field=models.CharField(db_index=True, max_length=255),
        ),
    ]
