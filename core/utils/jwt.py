import jwt
from django.conf import settings
from django.utils import timezone


def encode(data):
    return jwt.encode(data, settings.SECRET_KEY, algorithm="HS256")


def decode(token):
    return jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])


def get_auth_token(user, type: str = "access"):
    base_claims = {
        "token_type": type,
        "iat": timezone.now(),
        "sub": str(user.id),
    }
    roles = []
    if user.is_superuser:
        roles = ["admin", "user"]
    elif user.has_contributed:
        roles = ["contributor", "user"]
    else:
        roles = ["user"]
    if type == "access":
        # Will expire in 30 minutes
        base_claims["exp"] = timezone.now() + timezone.timedelta(minutes=30)
        base_claims["user_claims"] = {
            "x-hasura-allowed-roles": roles,
            "x-hasura-user-id": str(user.id),
            "x-hasura-default-role": roles[0],
        }
    elif type == "refresh":
        # Will expire in 24 hours
        base_claims["exp"] = timezone.now() + timezone.timedelta(minutes=1440)
        pass
    return encode(base_claims)
