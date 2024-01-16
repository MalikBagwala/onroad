import strawberry
from core.types import BaseResponse
from rest_framework import status
from django.template.loader import render_to_string
from core.tasks.send_email import send_email
from django.conf import settings
from core.models import User, OtpTypes, Otp
from django.db.models import Q
from django.utils import timezone


@strawberry.type
class SendEmailOtpResponse(BaseResponse):
    data: None
    pass


GENERIC_MESSAGE = "If the email address you provided is associated with an account, you will receive an OTP to verify your email address."


def send_email_otp(self, email: str) -> SendEmailOtpResponse:
    try:
        user = User.objects.get(email=email, email_verified=False, is_active=True)
        otp = Otp.objects.filter(
            user=user,
            used=False,
            expires_at__gt=timezone.now(),
            type=OtpTypes.EMAIL.value,
        ).first()

        if not otp:
            otp = Otp.objects.create(user=user)
        html_message = render_to_string(
            "email_otp.html",
            {
                "otp": otp.otp,
                "username": str(user),
                "expires_in": f"{settings.OTP_EXPIRATION_MINUTES} minutes",
                "verification_link": f"https://{settings.DOMAIN_NAME}/api/verify/otp/{otp.user.id}/{otp.otp}/",
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
