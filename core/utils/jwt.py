import jwt
from django.conf import settings
from django.utils import timezone


def encode(data):
    return jwt.encode(data, settings.SECRET_KEY, algorithm="HS256")


def decode(token):
    return jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])


def get_access_token(user):
    roles = []
    if user.is_superuser:
        roles = ["admin", "user"]
    elif user.has_contributed:
        roles = ["contributor", "user"]
    else:
        roles = ["user"]
    current_time = timezone.now()
    expiration_delta = timezone.timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRATION_MINUTES
    )
    return encode(
        {
            "iat": current_time,
            "sub": str(user.id),
            "exp": current_time + expiration_delta,
            "user_claims": {
                "x-hasura-allowed-roles": roles,
                "x-hasura-user-id": str(user.id),
                "x-hasura-default-role": roles[0],
            },
        }
    )
