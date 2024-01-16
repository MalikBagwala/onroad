import uuid

from django.db import models


class AbstractTimestamp(models.Model):
    """
    Time track model entries.

    Use mostly on transactional data to track latest changes.
    """

    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True, editable=False)

    class Meta:
        abstract = True


class UUIDPrimaryKey(models.Model):
    """
    UUID primary key model.

    Use mostly on transactional data to track latest changes.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    class Meta:
        abstract = True
