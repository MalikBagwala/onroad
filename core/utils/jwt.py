import jwt
from django.conf import settings
from django.utils import timezone


def encode(data):
    return jwt.encode(data, settings.SECRET_KEY, algorithm="HS256")


def decode(token):
    return jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])


def get_auth_token(user, expire_in: int = 1440, type: str = "access"):
    roles = []
    if user.is_superuser:
        roles = ["admin", "user"]
    elif user.has_contributed:
        roles = ["contributor", "user"]
    else:
        roles = ["user"]
    return encode(
        {
            "token_type": type,
            "exp": timezone.now() + timezone.timedelta(minutes=expire_in),
            "iat": timezone.now(),
            "sub": str(user.id),
            "user_claims": {
                "x-hasura-allowed-roles": roles,
                "x-hasura-user-id": str(user.id),
                "x-hasura-default-role": roles[0],
            },
        }
    )
