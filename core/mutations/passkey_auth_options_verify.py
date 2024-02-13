import strawberry
from webauthn import base64url_to_bytes, verify_authentication_response
from core.models import UserPassKeys
from core.types import BaseResponse, Tokens
from strawberry.types import Info
from django.conf import settings


@strawberry.type
class PasskeyAuthOptionsVerifyResponse(BaseResponse):
    data: Tokens | None


def passkey_auth_options_verify(
    self, credential: str, credential_id: str, info: Info
) -> PasskeyAuthOptionsVerifyResponse:
    try:
        passkey = UserPassKeys.objects.get(
            credential_id=base64url_to_bytes(credential_id)
        )
        stored_challenge = info.context.request.session["auth_challenge"]
        verification_response = verify_authentication_response(
            expected_challenge=base64url_to_bytes(stored_challenge),
            credential=credential,
            expected_origin=settings.CSRF_TRUSTED_ORIGINS,
            expected_rp_id=settings.DOMAIN_NAME,
            credential_current_sign_count=passkey.sign_count,
            credential_public_key=passkey.public_key,
        )
        passkey.sign_count = verification_response.new_sign_count
        passkey.save()
        info.context.request.session.pop("auth_challenge")
        return PasskeyAuthOptionsVerifyResponse(
            success=True,
            message=f"Registration process success",
            data=Tokens(
                accessToken=passkey.user.get_access_token(),
                refreshToken=passkey.user.get_refresh_token(),  # type: ignore
            ),
            code=200,
        )
    except Exception as e:
        return PasskeyAuthOptionsVerifyResponse(
            success=False,
            message=str(e),
            data=None,
            code=400,
        )
