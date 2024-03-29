import strawberry
import core.models as models
from core.types import BaseResponse
from rest_framework import status
from django.template.loader import render_to_string
from django.contrib.sites.shortcuts import get_current_site
from core.tasks.send_email import send_email
from django.conf import settings

from core.utils.exception import parse_exception


@strawberry.type
class LoginWithMagicLinkResponse(BaseResponse):
    data: None
    pass


GENERIC_MESSAGE = "If the email address you provided is associated with an account, you will receive an email with a link to sign in"


def login_with_magic_link(self, email: str) -> LoginWithMagicLinkResponse:
    try:
        user = models.User.objects.get(email=email, email_verified=True, is_active=True)
        html_message = render_to_string(
            "magic_link.html", {"magic_link": user.get_login_link()}
        )
        send_email.send(
            "Sign in to OnRoad",
            html_message,
            [email],
        )

        return LoginWithMagicLinkResponse(
            success=True,
            message=GENERIC_MESSAGE,
            data=None,
            code=200,
        )

    except Exception as e:
        return LoginWithMagicLinkResponse(
            success=True,
            message=parse_exception(e, "Failed to send magic link"),
            data=None,
            code=status.HTTP_400_BAD_REQUEST,
        )
