from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse
import requests
from core.enums import OtpTypes
from core.models import Otp, User
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
    throttle_classes,
)
from django.utils import timezone
from django.shortcuts import redirect, render
from os import getenv
from django.contrib.auth.models import Group
from django.conf import settings
from rest_framework.throttling import AnonRateThrottle


@api_view(["GET"])
@authentication_classes([])
@permission_classes([])
@throttle_classes([AnonRateThrottle])
def verify_otp(request, user_id, otp):
    try:
        otp = Otp.objects.get(
            user__id=user_id,
            otp=otp,
            used=False,
            expires_at__gt=timezone.now(),
            type=OtpTypes.EMAIL.value,
        )
        otp.used = True
        otp.save()
        otp.user.email_verified = True
        otp.user.save()
    except ObjectDoesNotExist:
        return render(request, "otp_invalid.html")
    return render(request, "otp_verified.html", {"username": str(otp.user)})


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
