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

# from core.api_views import JWTAuthRestMiddleware
# from rest_framework.permissions import IsAuthenticated


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
