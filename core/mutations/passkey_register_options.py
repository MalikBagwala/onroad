import json
from uuid import uuid4
import strawberry
from webauthn import generate_registration_options, options_to_json
from core.models import User
from core.types import BaseResponse

from strawberry.scalars import JSON
from strawberry.types import Info
from django.conf import settings
from webauthn.helpers.structs import (
    AttestationConveyancePreference,
    AuthenticatorSelectionCriteria,
    AuthenticatorAttachment,
)


@strawberry.type
class PasskeyRegisterOptions(BaseResponse):
    data: JSON | None


def passkey_register_options(self, name: str, info: Info) -> PasskeyRegisterOptions:
    try:
        user = info.context.request.user
        if not user.id:
            user = User.objects.create(username=name, email=name)
        options = generate_registration_options(
            rp_id=settings.DOMAIN_NAME,
            rp_name="OnRoad",
            user_id=user.id.bytes,
            user_name=user.username,
            user_display_name=f"{user.username}@onroad",
            attestation=AttestationConveyancePreference.DIRECT,
            authenticator_selection=AuthenticatorSelectionCriteria(
                authenticator_attachment=AuthenticatorAttachment.PLATFORM
            ),
        )
        data = json.loads(options_to_json(options))
        print(data)
        info.context.request.session["challenge"] = data.get("challenge")
        info.context.request.session["user_id"] = user.id
        return PasskeyRegisterOptions(
            success=True,
            message=f"Registration process intialized",
            data=data,
            code=200,
        )
    except Exception as e:
        return PasskeyRegisterOptions(
            success=False,
            message=str(e),
            data=None,
            code=400,
        )
