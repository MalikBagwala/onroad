import jwt
from django.conf import settings
from django.utils import timezone


def encode(data):
    return jwt.encode(data, settings.SECRET_KEY, algorithm="HS256")


def decode(token):
    return jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])


def get_auth_token(user, expire_in: int = 1440, type: str = "access"):
    return encode(
        {
            "token_type": type,
            "exp": timezone.now() + timezone.timedelta(minutes=expire_in),
            "iat": timezone.now(),
            "sub": str(user.id),
            "user_claims": {
                "x-hasura-allowed-roles": ["admin", "user"]
                if user.is_superuser
                else ["user"],
                "x-hasura-user-id": str(user.id),
                "x-hasura-default-role": "admin" if user.is_superuser else "user",
            },
        }
    )
