# Generated by Django 5.0.2 on 2024-02-13 05:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0024_alter_contribution_downvotes_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userpasskeys',
            name='credential_id',
            field=models.CharField(max_length=255),
        ),
    ]
