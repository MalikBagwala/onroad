from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from core.models import User
from django.conf import settings
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "city"]


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # The default result (access/refresh tokens)
        data = super(CustomTokenObtainPairSerializer, self).validate(attrs)
        # Custom data you want to include
        data.update({"id": self.user.id})  # type: ignore
        # and everything else you want to send in the response
        return data

    @classmethod
    def get_token(cls, user: User):
        token = super().get_token(user)
        user_roles = list(user.groups.values_list("name", flat=True))
        user_claims = {
            "x-hasura-allowed-roles": user_roles,
            "x-hasura-user-id": str(user.id),  # type: ignore
        }
        if user.is_superuser:
            admin_group = settings.HASURA_ADMIN_ROLE
            user_claims["x-hasura-allowed-roles"].append(admin_group)
            user_claims["x-hasura-default-role"] = admin_group
        else:
            user_claims["x-hasura-default-role"] = user_roles[user_roles.index("user")]
        token["user_claims"] = user_claims
        return token


class UserRegistrationInputSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(max_length=100, required=True)
    confirm_password = serializers.CharField(max_length=100, required=True)

    def validate_password(self, value):
        try:
            validate_password(value)
        except Exception as e:
            raise serializers.ValidationError(str(e))
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is not valid.")
        return value

    def validate(self, data):
        password = data.get("password")
        confirm_password = data.get("confirm_password")

        if password != confirm_password:
            raise serializers.ValidationError("Passwords do not match.")

        return data


class ChangePasswordSerializer(serializers.Serializer):
    user_id = serializers.UUIDField(required=True)
    request_id = serializers.UUIDField(required=True)
    password = serializers.CharField(max_length=100, required=True)
    confirm_password = serializers.CharField(max_length=100, required=True)

    def validate_password(self, value):
        try:
            validate_password(value)
        except Exception as e:
            raise serializers.ValidationError(str(e))
        return value

    def validate(self, data):
        password = data.get("password")
        confirm_password = data.get("confirm_password")

        if password != confirm_password:
            raise serializers.ValidationError("Passwords do not match.")

        return data
