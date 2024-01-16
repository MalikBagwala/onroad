import uuid
import strawberry
import strawberry_django
from core.enums import OtpTypes
from core.types import BaseResponse
from core.models import Otp
from django.utils import timezone


@strawberry.type
class VerifyOtpResponse(BaseResponse):
    data: None
    pass


@strawberry_django.input(Otp)
class OtpInput:
    user_id: uuid.UUID
    otp: strawberry.auto
    type: str
    pass


def verify_otp(self, input: OtpInput) -> VerifyOtpResponse:
    try:
        otp = Otp.objects.get(
            user__id=input.user_id,
            otp=input.otp,
            used=False,
            expires_at__gt=timezone.now(),
            type=input.type,
        )

        otp.used = True
        if input.type == OtpTypes.EMAIL.value:
            otp.user.email_verified = True
        elif input.type == OtpTypes.PHONE.value:
            pass

        otp.user.save()
        otp.save()
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
