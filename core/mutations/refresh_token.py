import uuid
import strawberry
import core.models as models
from django.core.exceptions import ObjectDoesNotExist
from core.types import BaseResponse
from rest_framework import status
from django.utils import timezone
from enum import Enum


@strawberry.type
class RefreshTokenResponse(BaseResponse):
    data: str | None


def refresh_token(self, refreshToken: uuid.UUID) -> RefreshTokenResponse:
    try:
        token = models.RefreshToken.objects.get(
            token=refreshToken, user__is_active=True, expires_at__gt=timezone.now()
        )
        return RefreshTokenResponse(
            success=True,
            message=f"Access token refreshed",
            data=token.user.get_access_token(),
            code=200,
        )
    except ObjectDoesNotExist as e:
        return RefreshTokenResponse(
            success=False,
            message="Invalid Credentials",
            data=None,
            code=status.HTTP_400_BAD_REQUEST,
        )
    except Exception as e:
        return RefreshTokenResponse(
            success=False,
            message=str(e),
            data=None,
            code=status.HTTP_400_BAD_REQUEST,
        )
