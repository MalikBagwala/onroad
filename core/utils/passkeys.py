import json
import uuid
from django.conf import settings
from webauthn import (
    generate_registration_options,
    options_to_json,
)
from webauthn.helpers.structs import (
    AttestationConveyancePreference,
    AuthenticatorSelectionCriteria,
    AuthenticatorAttachment,
)


def gen_passkey_registration_options(email: str):
    options = generate_registration_options(
        rp_id=settings.DOMAIN_NAME,
        challenge=uuid.uuid4().bytes,
        rp_name="OnRoad",
        user_name=email,
        user_display_name=email,
        user_id=uuid.uuid4().bytes,
        attestation=AttestationConveyancePreference.DIRECT,
        authenticator_selection=AuthenticatorSelectionCriteria(
            authenticator_attachment=AuthenticatorAttachment.PLATFORM
        ),
    )
    return json.loads(options_to_json(options))


def verify_passkey_registration():
    # return verify_registration_response(credential=)
    pass
