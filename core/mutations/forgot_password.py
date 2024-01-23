import strawberry
from core.types import BaseResponse
from rest_framework import status
from django.template.loader import render_to_string
from core.tasks.send_email import send_email
from django.conf import settings
from core.models import PasswordChangeRequest, User
from django.db.models import Q
from django.utils import timezone


@strawberry.type
class ForgotPasswordResponse(BaseResponse):
    data: None
    pass


GENERIC_MESSAGE = "Please check your email for a link to reset your password, once reset you will be logged in automatically!"


def forgot_password(self, identity: str) -> ForgotPasswordResponse:
    try:
        user = User.objects.filter(Q(email=identity) | Q(username=identity)).first()
        change_request, _ = PasswordChangeRequest.objects.get_or_create(
            user=user,
            used=False,
            expires_at__gt=timezone.now(),
            defaults={"user_id": user.id},  # type: ignore
        )
        reset_link = f"https://{settings.DOMAIN_NAME}/reset/{change_request.id}?u={user.id}"  # type: ignore
        html_message = render_to_string(
            "forgot_password.html",
            {
                "username": str(change_request.user),
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
