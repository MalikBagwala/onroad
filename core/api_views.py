from strawberry.django.views import GraphQLView
from rest_framework import exceptions
from rest_framework.authentication import BaseAuthentication
from core.models import User
from core.utils.exception import parse_exception


class JWTAuthGraphQLView(GraphQLView):
    def get_context(self, request, response):
        context = super().get_context(request, response)
        try:
            auth_header = request.headers.get("authorization", "")
            jwt_token = auth_header.split(" ")[1]
            request.user = User.get_user_from_access_token(jwt_token)  # type: ignore
        except Exception as e:
            pass
        return context


class JWTAuthRestMiddleware(BaseAuthentication):
    def authenticate(self, request):
        # Get the JWT token from the request
        try:
            auth_header = request.headers.get("authorization", "")
            jwt_token = auth_header.split(" ")[1]
            user = User.get_user_from_access_token(jwt_token)
            return user, None
        except Exception as e:
            raise exceptions.AuthenticationFailed(
                parse_exception(e, "Invalid Auth Credentials")
            )
