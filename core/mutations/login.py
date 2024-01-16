import json
import strawberry
import core.models as models
from django.core.exceptions import ObjectDoesNotExist
from core.types import BaseResponse, Tokens
from rest_framework import status


@strawberry.type
class LoginResponse(BaseResponse):
    data: Tokens | None


def login(self, email: str, password: str) -> LoginResponse:
    try:
        user = models.User.objects.get(email=email, is_active=True)
        is_correct = user.check_password(password)
        if not user or not is_correct:
            raise Exception("Invalid credentials")
        tokens = user.get_tokens()
        return LoginResponse(
            success=True,
            message=f"Welcome to OnRoad, {user.first_name}",
            data=Tokens(
                accessToken=tokens["accessToken"],
                refreshToken=tokens["refreshToken"],
            ),
            code=200,
        )

    except ObjectDoesNotExist as e:
        return LoginResponse(
            success=False,
            message="Invalid Credentials",
            data=None,
            code=status.HTTP_400_BAD_REQUEST,
        )
    except Exception as e:
        return LoginResponse(
            success=False,
            message=str(e),
            data=None,
            code=status.HTTP_400_BAD_REQUEST,
        )
