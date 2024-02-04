import uuid
import strawberry
import strawberry_django
from core.enums import OtpTypes, UserTokenType
from core.types import BaseResponse
from core.models import UserToken
from django.utils import timezone
from strawberry.types import Info


@strawberry.type
class VerifyOtpResponse(BaseResponse):
    data: None
    pass


@strawberry_django.input(UserToken)
class OtpInput:
    otp: str
    type: str
    pass


def verify_otp(self, input: OtpInput, info: Info) -> VerifyOtpResponse:
    try:
        token = UserToken.objects.get(
            user__id=info.context.request.user.id,
            token=input.otp,
            used=False,
            expires_at__gt=timezone.now(),
            type=input.type,
        )

        token.used = True
        if input.type == UserTokenType.OTP.value:
            token.user.email_verified = True

        token.user.save()
        token.save()
        return VerifyOtpResponse(
            success=True,
            message="Otp Verified",
            data=None,
            code=200,
        )

    except Exception as e:
        return VerifyOtpResponse(
            success=False,
            message="Invalid Otp",
            data=None,
            code=400,
        )
