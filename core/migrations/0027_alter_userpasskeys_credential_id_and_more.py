# Generated by Django 5.0.2 on 2024-02-13 06:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0026_alter_userpasskeys_sign_count'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userpasskeys',
            name='credential_id',
            field=models.BinaryField(),
        ),
        migrations.AlterField(
            model_name='userpasskeys',
            name='public_key',
            field=models.BinaryField(),
        ),
    ]
