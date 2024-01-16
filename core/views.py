from django.core.exceptions import ObjectDoesNotExist
from django.forms import ValidationError
from rest_framework.response import Response
from rest_framework import status
from core.enums import OtpTypes
from core.models import Otp, PasswordChangeRequest
from .serializers import ChangePasswordSerializer
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
    throttle_classes,
)
from django.utils import timezone
from django.shortcuts import render
from django.db.models import Q
from rest_framework.throttling import (
    AnonRateThrottle,
    UserRateThrottle,
)


@api_view(["GET"])
@authentication_classes([])
@permission_classes([])
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
