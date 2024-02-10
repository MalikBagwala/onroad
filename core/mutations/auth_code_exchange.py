import strawberry
from core.enums import UserTokenType
import core.models as models
from django.core.exceptions import ObjectDoesNotExist
from core.types import BaseResponse, Tokens
from rest_framework import status
from django.utils import timezone


@strawberry.type
class AuthCodeExchangeResponse(BaseResponse):
    data: Tokens | None


def auth_code_exchange(self, code: str, type: str = "VC") -> AuthCodeExchangeResponse:
    try:
        token = models.UserToken.objects.get(
            token=code,
            user__is_active=True,
            expires_at__gt=timezone.now(),
            type=type,
            used=False,
        )
        if token.type != UserTokenType.REFRESH.value:
            token.used = True
            token.save()

        return AuthCodeExchangeResponse(
            success=True,
            message=f"Code Exchange Successful",
            data=Tokens(
                accessToken=token.user.get_access_token(),
                refreshToken=token.user.get_refresh_token(),  # type: ignore
            ),
            code=200,
        )
    except ObjectDoesNotExist as e:
        return AuthCodeExchangeResponse(
            success=False,
            message="Invalid Auth Code, or Invalid User",
            data=None,
            code=status.HTTP_400_BAD_REQUEST,
        )
    except Exception as e:
        return AuthCodeExchangeResponse(
            success=False,
            message=str(e),
            data=None,
            code=status.HTTP_400_BAD_REQUEST,
        )
