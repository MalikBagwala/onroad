import strawberry
from core.types import BaseResponse
from core.models import User, UserPassKeys
from webauthn.helpers import bytes_to_base64url

from core.utils.exception import parse_exception


@strawberry.type
class MemberType:
    type: str
    has_passkeys: bool


@strawberry.type
class MembershipTypeByEmailResponse(BaseResponse):
    data: MemberType
    pass


def membership_type_by_email(self, email: str) -> MembershipTypeByEmailResponse:
    try:
        user = User.objects.get(email=email)
        has_passkeys = False
        if user:
            has_passkeys = UserPassKeys.objects.filter(user=user).exists()
        return MembershipTypeByEmailResponse(
            success=True,
            message="User already exists",
            data=MemberType(type="RETURNING_USER", has_passkeys=has_passkeys),
            code=200,
        )

    except Exception as e:
        return MembershipTypeByEmailResponse(
            success=True,
            message=parse_exception(e, "User does not exist"),
            data=MemberType(type="NEW_USER", has_passkeys=False),
            code=200,
        )
