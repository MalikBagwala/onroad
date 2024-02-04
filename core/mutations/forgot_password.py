import random
import strawberry
from core.enums import UserTokenType
from core.types import BaseResponse
from django.template.loader import render_to_string
from core.tasks.send_email import send_email
from django.conf import settings
from core.models import User, UserToken
from django.db.models import Q
from django.utils import timezone

from core.utils.time import get_expires_in


@strawberry.type
class ForgotPasswordResponse(BaseResponse):
    data: None
    pass


GENERIC_MESSAGE = "Please check your email for a link to reset your password, once reset you will be logged in automatically!"


def forgot_password(self, identity: str) -> ForgotPasswordResponse:
    try:
        user = User.objects.filter(Q(email=identity) | Q(username=identity)).first()
        change_token, _ = UserToken.objects.get_or_create(
            user=user,
            used=False,
            type=UserTokenType.PASSWORD_RESET.value,
            expires_at__gt=timezone.now(),
            defaults={
                "expires_at": get_expires_in(minutes=5),
                "token": random.randbytes(32).hex(),
            },
        )
        reset_link = f"https://{settings.DOMAIN_NAME}/reset/{change_token.token}?u={user.id}"  # type: ignore
        html_message = render_to_string(
            "forgot_password.html",
            {
                "username": str(change_token.user),
                "reset_link": reset_link,
            },
        )
        if user:
            send_email.send(
                "OnRoad: Password Reset Request",
                html_message,
                [user.email],
            )

        return ForgotPasswordResponse(
            success=True,
            message=GENERIC_MESSAGE,
            data=None,
            code=200,
        )

    except Exception as e:
        return ForgotPasswordResponse(
            success=True,
            message=GENERIC_MESSAGE,
            data=None,
            code=200,
        )
