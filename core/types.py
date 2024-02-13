from typing import Optional
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
    first_name: Optional[str]
    last_name: Optional[str]
    city: Optional[uuid.UUID]


@strawberry.type
class Tokens:
    accessToken: str
    refreshToken: uuid.UUID


@strawberry.type
class PassKey:
    id: uuid.UUID
    credential_id: str
    user_id: uuid.UUID
