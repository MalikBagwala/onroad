import strawberry
from strawberry_django.optimizer import DjangoOptimizerExtension
from django.conf import settings
from core.mutations.forgot_password_confirm import (
    forgot_password_confirm,
    ForgotPasswordConfirmResponse,
)
from core.mutations.forgot_password import ForgotPasswordResponse, forgot_password
from core.mutations.login import login, LoginResponse
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
from core.queries.verify_otp import VerifyOtpResponse, verify_otp


@strawberry.type
class Query:
    @strawberry.field
    def version() -> str:
        return settings.APP_VERSION

    membership_type_by_email: MembershipTypeByEmailResponse = strawberry.field(
        resolver=membership_type_by_email
    )
    pass


@strawberry.type
class Mutation:
    login: LoginResponse = strawberry.field(resolver=login)
    register: RegisterResponse = strawberry.field(resolver=register)
    login_with_magic_link: LoginWithMagicLinkResponse = strawberry.field(
        resolver=login_with_magic_link
    )
    forgot_password: ForgotPasswordResponse = strawberry.field(resolver=forgot_password)
    forgot_password_confirm: ForgotPasswordConfirmResponse = strawberry.field(
        resolver=forgot_password_confirm
    )
    send_email_otp: SendEmailOtpResponse = strawberry.field(resolver=send_email_otp)
    verify_otp: VerifyOtpResponse = strawberry.field(resolver=verify_otp)
    pass


schema = strawberry.Schema(
    query=Query,
    mutation=Mutation,
    extensions=[DjangoOptimizerExtension],  # not required, but highly recommended
)
