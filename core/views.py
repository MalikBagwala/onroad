from uuid import uuid4
from django.http import JsonResponse
import requests
from core.models import User
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
    throttle_classes,
)
from django.shortcuts import redirect
from os import getenv
from django.contrib.auth.models import Group
from django.conf import settings
from rest_framework.throttling import AnonRateThrottle

from core.api_views import JWTAuthRestMiddleware
from rest_framework.permissions import IsAuthenticated
from django.conf import settings

from core.serializers import AttachmentSerializer
from .utils.s3 import upload_file_obj


@api_view(["GET"])
@authentication_classes([])
@permission_classes([])
@throttle_classes([AnonRateThrottle])
def google_oauth(request):
    try:
        params = dict(request.query_params)
        response_id = requests.post(
            "https://oauth2.googleapis.com/token",
            data={
                "code": params["code"],
                "client_id": getenv("GOOGLE_CLIENT_ID"),
                "client_secret": getenv("GOOGLE_CLIENT_SECRET"),
                "redirect_uri": f"https://{settings.DOMAIN_NAME}/api/oauth",
                "grant_type": "authorization_code",
            },
        )
        data = response_id.json()
        if response_id.status_code != 200:
            raise Exception("Unable to get id token")
        token_content = requests.get(
            "https://oauth2.googleapis.com/tokeninfo", {"id_token": data["id_token"]}
        )
        token_json = token_content.json()
        user, _ = User.objects.update_or_create(
            email=token_json["email"],
            defaults={
                "first_name": token_json.get("given_name", ""),
                "last_name": token_json.get("family_name", ""),
                "username": token_json["email"],
                "email_verified": token_json.get("email_verified") == "true",
                "google_id": token_json["sub"],
                "avatar": token_json.get("picture", ""),
            },
        )
        user.groups.add(Group.objects.filter(name="user").first())
        user.save()
        return redirect(user.get_login_link())
    except Exception as e:
        return JsonResponse({"error": str(e)})


@api_view(["PUT"])
@authentication_classes([JWTAuthRestMiddleware])
@permission_classes([IsAuthenticated])
def upload_file(request):
    try:
        file = request.data.get("file", None)
        attachment_id = request.data.get("media_id", uuid4())
        media = upload_file_obj(file, request.user, attachment_id)
        if media is not None:
            return JsonResponse(
                {"success": True, "data": AttachmentSerializer(media).data},
                status=201,
            )
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
