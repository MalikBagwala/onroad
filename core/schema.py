import strawberry
from strawberry_django.optimizer import DjangoOptimizerExtension
from django.conf import settings
from core.mutations.auth_code_exchange import (
    AuthCodeExchangeResponse,
    auth_code_exchange,
)
from core.mutations.change_password import change_password, ChangePasswordResponse
from core.mutations.forgot_password_confirm import (
    forgot_password_confirm,
    ForgotPasswordConfirmResponse,
)
from core.mutations.forgot_password import ForgotPasswordResponse, forgot_password
from core.mutations.login import login, LoginResponse
from core.mutations.refresh_token import RefreshTokenResponse, refresh_token
from core.mutations.register import register, RegisterResponse
from core.mutations.login_with_magic_link import (
    login_with_magic_link,
    LoginWithMagicLinkResponse,
)
from core.mutations.send_email_otp import SendEmailOtpResponse, send_email_otp
from core.queries.membership_type import (
    MembershipTypeByEmailResponse,
    membership_type_by_email,
)
from core.queries.my_contributions import MyContributionsResponse, my_contributions
from core.queries.verify_otp import VerifyOtpResponse, verify_otp
from strawberry.permission import BasePermission
from strawberry.types import Info
from core.types import UserType


class IsAuthenticated(BasePermission):
    message = "User is not authenticated"

    def has_permission(self, _, info: Info, **kwargs) -> bool:
        usr = info.context.request.user
        if usr and usr.id and usr.is_active:
            return True
        return False


@strawberry.type
class Query:
    @strawberry.field
    def version() -> str:
        return settings.APP_VERSION

    @strawberry.field
    def me(self, info: Info) -> UserType | None:
        try:
            user = info.context.request.user
            return UserType(
                id=user.id,
                username=user.username,
                email=user.email,
                first_name=user.first_name,
                last_name=user.last_name,
                city=user.city_id,
            )
        except:
            return None

    membership_type_by_email: MembershipTypeByEmailResponse = strawberry.field(
        resolver=membership_type_by_email
    )
    my_contributions: MyContributionsResponse = strawberry.field(
        resolver=my_contributions, permission_classes=[IsAuthenticated]
    )
    pass


@strawberry.type
class Mutation:
    login: LoginResponse = strawberry.field(resolver=login)
    refresh_token: RefreshTokenResponse = strawberry.field(resolver=refresh_token)
    register: RegisterResponse = strawberry.field(resolver=register)
    login_with_magic_link: LoginWithMagicLinkResponse = strawberry.field(
        resolver=login_with_magic_link
    )
    forgot_password: ForgotPasswordResponse = strawberry.field(resolver=forgot_password)
    change_password: ChangePasswordResponse = strawberry.field(
        resolver=change_password, permission_classes=[IsAuthenticated]
    )
    forgot_password_confirm: ForgotPasswordConfirmResponse = strawberry.field(
        resolver=forgot_password_confirm
    )
    send_email_otp: SendEmailOtpResponse = strawberry.field(resolver=send_email_otp)
    verify_otp: VerifyOtpResponse = strawberry.field(
        resolver=verify_otp, permission_classes=[IsAuthenticated]
    )
    auth_code_exchange: AuthCodeExchangeResponse = strawberry.field(
        resolver=auth_code_exchange
    )

    pass


schema = strawberry.Schema(
    query=Query,
    mutation=Mutation,
    extensions=[DjangoOptimizerExtension],  # not required, but highly recommended
)
