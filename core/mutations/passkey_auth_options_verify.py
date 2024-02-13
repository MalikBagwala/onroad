import json
import os
from uuid import uuid4
import uuid
import strawberry
from django.core.exceptions import ObjectDoesNotExist
from webauthn import base64url_to_bytes, verify_authentication_response, options_to_json
from core.models import UserPassKeys
from core.types import BaseResponse
from rest_framework.exceptions import ValidationError

from core.utils.validation_error_serializer import validation_error_serializer
from strawberry.scalars import JSON
from strawberry.types import Info
from django.conf import settings


@strawberry.type
class PasskeyAuthOptionsVerifyResponse(BaseResponse):
    data: None


def passkey_auth_options_verify(
    self, credential: str, passkey_id: uuid.UUID, info: Info
) -> PasskeyAuthOptionsVerifyResponse:
    try:
        passkey = UserPassKeys.objects.get(pk=passkey_id)
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
            data=None,
            code=200,
        )
    except Exception as e:
        return PasskeyAuthOptionsVerifyResponse(
            success=False,
            message=str(e),
            data=None,
            code=400,
        )
