from json import loads
from uuid import uuid4
from django.http import JsonResponse
import requests
from core.models import Attachment, User
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
from .utils.spaces import spaces_client


@api_view(["GET"])
@authentication_classes([])
@permission_classes([])
@throttle_classes([AnonRateThrottle])
def google_oauth(request):
    try:
        params = dict(request.query_params)
        print(params)
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
        print(token_json)
        user, _ = User.objects.update_or_create(
            email=token_json["email"],
            defaults={
                "first_name": token_json["given_name"],
                "last_name": token_json["family_name"],
                "username": token_json["email"],
                "email_verified": token_json["email_verified"] == "true",
                "google_id": token_json["sub"],
                "avatar": token_json["picture"],
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
        raw_file_name = request.data.get("name", getattr(file, "name", None))
        raw_file_ext = raw_file_name.split(".")[-1].lower()
        content_type = getattr(file, "content_type", None)
        size = getattr(file, "size", None)
        access = "public-read"
        bucket = settings.BUCKET
        key = f"{settings.ENVIRONMENT[0]}/{attachment_id}.{raw_file_ext}"
        params = dict(
            Bucket=bucket,
            Key=key,
            Body=file,
            ACL=access,
            ContentType=content_type,
        )
        response = spaces_client.put_object(**params)
        if response["ETag"] is not None:
            media, _ = Attachment.objects.update_or_create(
                id=attachment_id,
                defaults={
                    "key": key,
                    "mime_type": content_type,
                    "url": f"https://cdn.maalik.dev/{key}",
                    "etag": loads(response["ETag"]),
                    "size": size,
                    "created_by": request.user,
                },
            )
            return JsonResponse(
                {
                    "success": True,
                    "data": {
                        "id": media.id,
                        "key": key,
                        "media_kind": content_type,
                        "url": media.url.url,
                        "size": size,
                        "bucket": bucket,
                        "etag": loads(response["ETag"]),
                    },
                },
                status=201,
            )
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
