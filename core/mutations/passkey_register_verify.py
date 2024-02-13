from ast import Pass
from os import access
import strawberry
from webauthn import verify_registration_response
from core.models import User, UserPassKeys
from core.types import BaseResponse, PassKey, Tokens
from strawberry.types import Info
from django.conf import settings
from webauthn.helpers import base64url_to_bytes, bytes_to_base64url


@strawberry.type
class PasskeyRegisterVerifyData:
    passKey: PassKey
    tokens: Tokens


@strawberry.type
class PasskeyRegisterVerifyResponse(BaseResponse):
    data: PasskeyRegisterVerifyData | None


def passkey_register_verify(
    self, credential: str, info: Info
) -> PasskeyRegisterVerifyResponse:
    try:
        passkey = info.context.request.session.get("passkey")
        stored_challenge = passkey.get("challenge")
        user_id = passkey.get("user_id")
        user_name = passkey.get("username")
        res = verify_registration_response(
            expected_challenge=base64url_to_bytes(stored_challenge),
            credential=credential,
            expected_origin=settings.CSRF_TRUSTED_ORIGINS,
            expected_rp_id=settings.DOMAIN_NAME,
        )
        user, _ = User.objects.get_or_create(
            id=user_id,
            defaults={"username": user_name, "email": user_name, "id": user_id},
        )
        passkey = UserPassKeys.objects.create(
            user=user,
            credential_id=res.credential_id,
            public_key=res.credential_public_key,
            sign_count=res.sign_count,
            description=user_name,
        )
        info.context.request.session.pop("passkey")
        return PasskeyRegisterVerifyResponse(
            success=True,
            message=f"Registration process successful",
            data=PasskeyRegisterVerifyData(
                passKey=PassKey(
                    id=passkey.id,
                    user_id=passkey.user_id,  # type: ignore
                    credential_id=bytes_to_base64url(passkey.credential_id),
                ),
                tokens=Tokens(
                    accessToken=passkey.user.get_access_token(),
                    refreshToken=passkey.user.get_refresh_token(),  # type: ignore
                ),
            ),
            code=200,
        )
    except Exception as e:
        return PasskeyRegisterVerifyResponse(
            success=False,
            message=str(e),
            data=None,
            code=400,
        )
