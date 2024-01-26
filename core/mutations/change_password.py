import strawberry
from core.serializers import PasswordSerializer
from core.types import BaseResponse
from strawberry.types import Info
from rest_framework.exceptions import ValidationError
from core.utils import exception
from core.utils.validation_error_serializer import validation_error_serializer


@strawberry.type
class ChangePasswordResponse(BaseResponse):
    data: None
    pass


GENERIC_MESSAGE = "Password changed successfully!"


def change_password(
    self, password: str, confirm_password: str, info: Info
) -> ChangePasswordResponse:
    try:
        info.context.request.user.set_password(password)
        info.context.request.user.save()
        serializer = PasswordSerializer(
            data={"password": password, "confirm_password": confirm_password}
        )
        serializer.is_valid(raise_exception=True)
        return ChangePasswordResponse(
            success=True,
            message=GENERIC_MESSAGE,
            data=None,
            code=200,
        )
    except ValidationError as e:
        message, errors = validation_error_serializer(e)
        return ChangePasswordResponse(
            success=False,
            message=message,
            data=None,
            code=400,
            errors=errors,  # type: ignore
        )
    except Exception as e:
        return ChangePasswordResponse(
            success=True,
            message=exception.parse_exception(
                e, "Unable to change password, please try again"
            ),
            data=None,
            code=200,
        )
