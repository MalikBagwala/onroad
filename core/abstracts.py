import uuid
from django.db import models
from django.contrib.postgres.functions import RandomUUID
from django.db.models.functions import Now


class AbstractTimestamp(models.Model):
    """
    Time track model entries.

    Use mostly on transactional data to track latest changes.
    """

    created_at = models.DateTimeField(auto_now_add=True, editable=False, db_default=Now())  # type: ignore
    updated_at = models.DateTimeField(auto_now=True, editable=False, db_default=Now())  # type: ignore

    class Meta:
        abstract = True


class UUIDPrimaryKey(models.Model):
    """
    UUID primary key model.

    Use mostly on transactional data to track latest changes.
    """

    id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False, db_default=RandomUUID()
    )  # type: ignore

    class Meta:
        abstract = True


class CodeField(models.Model):
    """
    User friendly unique identifier
    """

    short = models.CharField(unique=True, max_length=20)

    class Meta:
        abstract = True
