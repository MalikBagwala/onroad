from onroad.settings import (
    OTP_EXPIRATION_MINUTES,
    PASSWORD_CHANGE_REQUEST_EXPIRATION_MINUTES,
    REFRESH_TOKEN_EXPIRATION_MINUTES,
    USER_TOKEN_EXPIRATION_MINUTES,
)
from django.utils import timezone


def get_refresh_token_expires_in():
    return timezone.now() + timezone.timedelta(minutes=REFRESH_TOKEN_EXPIRATION_MINUTES)


def get_otp_expires_at():
    return timezone.now() + timezone.timedelta(minutes=OTP_EXPIRATION_MINUTES)


def get_password_change_request_expires_at():
    return timezone.now() + timezone.timedelta(
        minutes=PASSWORD_CHANGE_REQUEST_EXPIRATION_MINUTES
    )


def get_user_token_expires_at():
    return timezone.now() + timezone.timedelta(minutes=USER_TOKEN_EXPIRATION_MINUTES)


def get_expires_in(minutes: int):
    return timezone.now() + timezone.timedelta(minutes=minutes)
