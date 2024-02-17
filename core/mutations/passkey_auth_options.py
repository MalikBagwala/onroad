import json
import strawberry
from webauthn import (
    generate_authentication_options,
    options_to_json,
)
from core.types import BaseResponse
from strawberry.scalars import JSON
from strawberry.types import Info
from django.conf import settings


@strawberry.type
class PasskeyAuthOptionsResponse(BaseResponse):
    data: JSON | None


def passkey_auth_options(self, info: Info) -> PasskeyAuthOptionsResponse:
    try:
        options = generate_authentication_options(
            rp_id=settings.DOMAIN_NAME,
            # allow_credentials=[]
        )
        data = json.loads(options_to_json(options))
        info.context.request.session["auth_challenge"] = data.get("challenge")
        return PasskeyAuthOptionsResponse(
            success=True,
            message=f"Please verify the challenge and sign the response to authenticate.",
            data=data,
            code=200,
        )
    except Exception as e:
        return PasskeyAuthOptionsResponse(
            success=False,
            message=str(e),
            data=None,
            code=400,
        )
