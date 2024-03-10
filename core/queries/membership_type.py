import strawberry
from core.types import BaseResponse
from core.models import User, UserPassKeys
from webauthn.helpers import bytes_to_base64url

from core.utils.exception import parse_exception


@strawberry.type
class MemberType:
    type: str
    credentialIds: list[str] | None


@strawberry.type
class MembershipTypeByEmailResponse(BaseResponse):
    data: MemberType
    pass


def membership_type_by_email(self, email: str) -> MembershipTypeByEmailResponse:
    try:
        user = User.objects.get(email=email)
        passkeys = None
        if user:
            passkeys_bytes = UserPassKeys.objects.filter(user=user).values_list(
                "credential_id",
                flat=True,
            )
            passkeys = [bytes_to_base64url(passkey) for passkey in passkeys_bytes]
        return MembershipTypeByEmailResponse(
            success=True,
            message="User already exists",
            data=MemberType(type="RETURNING_USER", credentialIds=passkeys),
            code=200,
        )

    except Exception as e:
        return MembershipTypeByEmailResponse(
            success=True,
            message=parse_exception(e, "User does not exist"),
            data=MemberType(type="NEW_USER", credentialIds=None),
            code=200,
        )
