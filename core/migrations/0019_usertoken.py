# Generated by Django 5.0.1 on 2024-02-04 04:53

import core.utils.time
import django.contrib.postgres.functions
import django.db.models.deletion
import django.db.models.functions.datetime
import uuid
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0018_alter_make_code_alter_vehicletype_code'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserToken',
            fields=[
                ('created_at', models.DateTimeField(auto_now_add=True, db_default=django.db.models.functions.datetime.Now())),
                ('updated_at', models.DateTimeField(auto_now=True, db_default=django.db.models.functions.datetime.Now())),
                ('id', models.UUIDField(db_default=django.contrib.postgres.functions.RandomUUID(), default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('token', models.CharField(db_default=django.contrib.postgres.functions.RandomUUID(), db_index=True, editable=False, max_length=255)),
                ('used', models.BooleanField(default=False)),
                ('expires_at', models.DateTimeField(blank=True, default=core.utils.time.get_user_token_expires_at, null=True)),
                ('type', models.CharField(choices=[('OT', 'OTP'), ('VC', 'Verifier Code'), ('PR', 'Password Reset'), ('RF', 'Refresh')], db_default=models.Value('VC'), max_length=2)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name_plural': 'User Tokens',
                'db_table': 'user_tokens',
            },
        ),
    ]
