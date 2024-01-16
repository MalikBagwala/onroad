from typing import Optional
import strawberry
import core.models as models
from django.core.exceptions import ObjectDoesNotExist
from core.serializers import UserRegistrationInputSerializer
from core.types import BaseResponse, Tokens, UserType
from rest_framework.exceptions import ValidationError
from django.contrib.auth.models import Group

from core.utils.validation_error_serializer import validation_error_serializer


@strawberry.type
class RegisterDataType:
    user: UserType
    tokens: Tokens


@strawberry.type
class RegisterResponse(BaseResponse):
    data: RegisterDataType | None


@strawberry.input
class RegisterInput:
    email: str
    password: str
    confirm_password: str


def register(self, input: RegisterInput) -> RegisterResponse:
    try:
        input_dict = strawberry.asdict(input)
        serializer = UserRegistrationInputSerializer(data=input_dict)
        serializer.is_valid(raise_exception=True)
        # Remove confirm_password from input_dict
        input_dict.pop("confirm_password")
        user = models.User.objects.create(**input_dict, username=input_dict["email"])
        user.set_password(input.password)
        user.save()
        user.groups.add(Group.objects.filter(name="user").first())
        tokens = user.get_tokens()
        return RegisterResponse(
            success=True,
            message=f"Welcome to OnRoad, {user.username}!",
            data=RegisterDataType(
                user=UserType(
                    id=user.id,
                    username=user.username,
                    email=user.email,
                    first_name=user.first_name,
                    last_name=user.last_name,
                    city=user.city_id,  # type: ignore
                ),
                tokens=Tokens(
                    accessToken=tokens["accessToken"],
                    refreshToken=tokens["refreshToken"],
                ),
            ),
            code=200,
        )
    except ValidationError as e:
        message, errors = validation_error_serializer(e)
        return RegisterResponse(
            success=False,
            message=message,
            data=None,
            code=400,
            errors=errors,  # type: ignore
        )
    except ObjectDoesNotExist as e:
        return RegisterResponse(
            success=False,
            message="Invalid Credentials",
            data=None,
            code=400,
        )
    except Exception as e:
        return RegisterResponse(
            success=False,
            message=str(e),
            data=None,
            code=400,
        )
