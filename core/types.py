import uuid
import strawberry
from strawberry.scalars import JSON


@strawberry.type
class BaseResponse:
    success: bool
    message: str
    code: int
    errors: JSON | None = None


@strawberry.type
class UserType:
    id: uuid.UUID
    username: str
    email: str
    first_name: str
    last_name: str
    city: str


@strawberry.type
class Tokens:
    accessToken: str
    refreshToken: str
