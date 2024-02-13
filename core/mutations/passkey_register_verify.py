import strawberry
from webauthn import verify_registration_response
from core.models import UserPassKeys
from core.types import BaseResponse, PassKey
from strawberry.types import Info
from django.conf import settings
from webauthn.helpers import base64url_to_bytes, bytes_to_base64url


@strawberry.type
class PasskeyRegisterVerifyResponse(BaseResponse):
    data: PassKey | None


def passkey_register_verify(
    self, credential: str, info: Info
) -> PasskeyRegisterVerifyResponse:
    try:
        stored_challenge = info.context.request.session.get("challenge")
        res = verify_registration_response(
            expected_challenge=base64url_to_bytes(stored_challenge),
            credential=credential,
            expected_origin=settings.CSRF_TRUSTED_ORIGINS,
            expected_rp_id=settings.DOMAIN_NAME,
        )
        passkey = UserPassKeys.objects.create(
            user=info.context.request.user,
            credential_id=res.credential_id,
            public_key=res.credential_public_key,
            sign_count=res.sign_count,
        )
        info.context.session.pop("challenge")
        return PasskeyRegisterVerifyResponse(
            success=True,
            message=f"Registration process successful",
            data=PassKey(
                id=passkey.id,
                user_id=passkey.user_id,  # type: ignore
                credential_id=bytes_to_base64url(passkey.credential_id),
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
