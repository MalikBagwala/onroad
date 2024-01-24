import uuid
import strawberry
from core.models import PasswordChangeRequest
from core.serializers import ChangePasswordSerializer
from core.types import BaseResponse, Tokens
from django.utils import timezone
from rest_framework.exceptions import ValidationError
from django.core.exceptions import ObjectDoesNotExist

from core.utils.validation_error_serializer import validation_error_serializer


@strawberry.type
class ForgotPasswordConfirmResponse(BaseResponse):
    data: Tokens | None
    pass


GENERIC_MESSAGE = (
    "Password changed successfully! You are now signed in automatically. :)"
)


@strawberry.input
class ForgotPasswordConfirmInput:
    request_id: uuid.UUID
    user_id: uuid.UUID
    password: str
    confirm_password: str


def forgot_password_confirm(
    self, input: ForgotPasswordConfirmInput
) -> ForgotPasswordConfirmResponse:
    try:
        serializer = ChangePasswordSerializer(data=strawberry.asdict(input))
        serializer.is_valid(raise_exception=True)
        request_id = input.request_id
        user_id = input.user_id
        change_request = PasswordChangeRequest.objects.get(
            id=request_id,
            user_id=user_id,
            used=False,
            expires_at__gt=timezone.now(),
        )
        change_request.user.set_password(input.password)
        change_request.user.save()
        change_request.used = True
        change_request.save()
        tokens = change_request.user.get_tokens()
        return ForgotPasswordConfirmResponse(
            success=True,
            message=GENERIC_MESSAGE,
            data=Tokens(
                accessToken=tokens["accessToken"],
                refreshToken=tokens["refreshToken"],
            ),
            code=200,
        )

    except ValidationError as e:
        message, errors = validation_error_serializer(e)
        return ForgotPasswordConfirmResponse(
            success=False,
            message=message,
            data=None,
            code=400,
            errors=errors,  # type: ignore
        )
    except ObjectDoesNotExist as e:
        return ForgotPasswordConfirmResponse(
            success=False,
            message="Invalid Request",
            data=None,
            code=400,
        )
    except Exception as e:
        return ForgotPasswordConfirmResponse(
            success=False,
            message=str(e),
            data=None,
            code=400,
        )
