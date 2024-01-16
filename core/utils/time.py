from onroad.settings import (
    OTP_EXPIRATION_MINUTES,
    PASSWORD_CHANGE_REQUEST_EXPIRATION_MINUTES,
)
from django.utils import timezone


def get_otp_expires_at():
    return timezone.now() + timezone.timedelta(minutes=OTP_EXPIRATION_MINUTES)


def get_password_change_request_expires_at():
    return timezone.now() + timezone.timedelta(
        minutes=PASSWORD_CHANGE_REQUEST_EXPIRATION_MINUTES
    )
