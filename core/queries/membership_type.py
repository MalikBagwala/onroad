import strawberry
from core.types import BaseResponse
from core.models import User


@strawberry.type
class MembershipTypeByEmailResponse(BaseResponse):
    data: str | None
    pass


def membership_type_by_email(self, email: str) -> MembershipTypeByEmailResponse:
    try:
        User.objects.get(email=email)
        return MembershipTypeByEmailResponse(
            success=True,
            message="User already exists",
            data="RETURNING_USER",  # type: ignore
            code=200,
        )

    except Exception as e:
        return MembershipTypeByEmailResponse(
            success=True,
            message="User does not exist",
            data="NEW_USER",  # type: ignore
            code=200,
        )
