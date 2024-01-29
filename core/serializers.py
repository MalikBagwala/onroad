from core.models import Attachment, User
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password


class AttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attachment
        fields = ["id", "url", "mime_type", "size", "created_at", "updated_at", "etag"]


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "city"]


class PasswordSerializer(serializers.Serializer):
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


class UserRegistrationInputSerializer(PasswordSerializer):
    email = serializers.EmailField(required=True)

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is not valid.")
        return value


class ChangePasswordSerializer(PasswordSerializer):
    user_id = serializers.UUIDField(required=True)
    request_id = serializers.UUIDField(required=True)
