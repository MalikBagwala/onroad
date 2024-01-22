from strawberry.django.views import GraphQLView

from core.models import User


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
