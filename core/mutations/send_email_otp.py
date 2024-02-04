import strawberry
from core.enums import UserTokenType
from core.types import BaseResponse
from django.template.loader import render_to_string
from core.tasks.send_email import send_email
from django.conf import settings
from core.models import User, UserToken
from django.utils import timezone
from core.utils.random import generate_otp

from core.utils.time import get_otp_expires_at


@strawberry.type
class SendEmailOtpResponse(BaseResponse):
    data: None
    pass


GENERIC_MESSAGE = "If the email address you provided is associated with an account, you will receive an OTP to verify your email address."


def send_email_otp(self, email: str) -> SendEmailOtpResponse:
    try:
        user = User.objects.get(email=email, email_verified=False, is_active=True)
        otp, _ = UserToken.objects.get_or_create(
            user=user,
            used=False,
            expires_at__gt=timezone.now(),
            type=UserTokenType.OTP.value,
            defaults={"expires_at": get_otp_expires_at(), "token": generate_otp()},
        )
        html_message = render_to_string(
            "email_otp.html",
            {
                "otp": otp.token,
                "username": str(user),
                "expires_in": f"{settings.OTP_EXPIRATION_MINUTES} minutes",
                "verification_link": f"https://{settings.DOMAIN_NAME}/api/verify/otp/{otp.user.id}/{otp.token}/",
            },  # type: ignore
        )
        if user:
            send_email.send(
                "OnRoad: E-Mail Verification",
                html_message,
                [user.email],
            )

        return SendEmailOtpResponse(
            success=True,
            message=GENERIC_MESSAGE,
            data=None,
            code=200,
        )

    except Exception as e:
        return SendEmailOtpResponse(
            success=True,
            message=GENERIC_MESSAGE,
            data=None,
            code=200,
        )
