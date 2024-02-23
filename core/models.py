import decimal
from os import urandom
from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.functions import RandomUUID

from core.utils.time import (
    get_expires_in,
    get_refresh_token_expires_in,
    get_user_token_expires_at,
)
from .abstracts import AbstractTimestamp, UUIDPrimaryKey
from django.db import models
from django.utils import timezone
from .enums import (
    PriceCategoryTypes,
    TransactionTypes,
    VoteTypes,
    VehicleCategories,
    TransmissionTypes,
    FluelTypes,
    ContributionStatus,
    UserTokenType,
)
from .utils import jwt
from random import randbytes
from webauthn.helpers import bytes_to_base64url
from django.conf import settings
from core.redis import store_refresh_token

# Create your models here.


class Country(UUIDPrimaryKey):
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=15, null=True, blank=True)

    class Meta:
        db_table = "countries"
        verbose_name_plural = "Countries"

    def __str__(self):
        return f"{self.name} ({self.code})"


class State(UUIDPrimaryKey):
    country = models.ForeignKey(Country, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=15, null=True, blank=True)

    class Meta:
        db_table = "states"

    def __str__(self):
        return f"{self.name} ({self.code})"


class City(UUIDPrimaryKey):
    state = models.ForeignKey(State, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=15, null=True, blank=True)

    class Meta:
        db_table = "cities"
        verbose_name_plural = "Cities"

    def __str__(self):
        return self.name


class User(AbstractUser, AbstractTimestamp, UUIDPrimaryKey):
    username = models.CharField(max_length=255, unique=True)
    email = models.EmailField(unique=True)
    avatar = models.ImageField(null=True, blank=True)
    google_id = models.CharField(max_length=255, null=True, blank=True, unique=True)
    apple_id = models.CharField(max_length=255, null=True, blank=True, unique=True)
    first_name = models.CharField(max_length=255, null=True, blank=True)
    last_name = models.CharField(max_length=255, null=True, blank=True)
    city = models.ForeignKey(City, on_delete=models.CASCADE, null=True, blank=True)
    email_verified = models.BooleanField(default=False)
    has_contributed = models.BooleanField(default=False)

    class Meta:
        db_table = "users"

    def get_access_token(self):
        return jwt.get_access_token(self)

    def get_refresh_token(self, client="web"):
        try:
            token_instance, _ = UserToken.objects.get_or_create(
                user=self,
                client=client,
                type=UserTokenType.REFRESH.value,
                expires_at__gt=timezone.now(),
                defaults={
                    "expires_at": get_refresh_token_expires_in(),
                },
            )
            store_refresh_token(
                self.id,
                bytes_to_base64url(randbytes(32)),
                settings.REFRESH_TOKEN_EXPIRATION_MINUTES,
            )
            # Get refresh tokens if an un-expired token already exists, else create a new one
            return token_instance.token
        except Exception as e:
            print("get_refresh_token", str(e))
            return None

    def get_tokens(self):
        return {
            "refreshToken": self.get_refresh_token(),
            "accessToken": self.get_access_token(),
        }

    def get_login_link(self, one_time: bool = False):
        if one_time:
            return f"https://{settings.DOMAIN_NAME}?access={self.get_access_token()}"
        auth_token, _ = UserToken.objects.get_or_create(
            user=self,
            type=UserTokenType.VERIFIER_CODE,
            expires_at__gt=timezone.now(),
            used=False,
            defaults={
                "expires_at": get_expires_in(minutes=5),
            },
        )
        return f"https://{settings.DOMAIN_NAME}?code={auth_token.token}&type={auth_token.type}"

    @classmethod
    def get_user_from_access_token(cls, token):
        try:
            decoded_token = jwt.decode(token)
            user_id = decoded_token["sub"]
            return cls.objects.get(id=user_id)
        except Exception as e:
            print("get_user_from_access_token", str(e))
            return None

    def __str__(self):
        return self.username

    pass


class UserToken(UUIDPrimaryKey, AbstractTimestamp):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=255, editable=False, db_default=RandomUUID(), db_index=True)  # type: ignore
    used = models.BooleanField(default=False)
    expires_at = models.DateTimeField(
        default=get_user_token_expires_at, null=True, blank=True
    )
    type = models.CharField(
        max_length=2,
        choices=UserTokenType.choices,
        db_default=UserTokenType.VERIFIER_CODE.value,
    )  # type: ignore
    client = models.CharField(max_length=255, db_default="web")  # type: ignore
    description = models.TextField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]
        db_table = "user_tokens"
        verbose_name_plural = "User Tokens"

    def __str__(self):
        return f"{self.user} - {self.expires_at}"


class UserPassKeys(UUIDPrimaryKey, AbstractTimestamp):
    name = models.CharField(max_length=64, null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    public_key = models.BinaryField()
    credential_id = models.BinaryField(unique=True)
    description = models.TextField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]
        db_table = "user_passkeys"
        verbose_name_plural = "User Passkeys"

    def __str__(self):
        return f"{self.user} - {self.credential_id}"


class Attachment(UUIDPrimaryKey, AbstractTimestamp):
    url = models.URLField(blank=True)
    key = models.CharField(max_length=255, null=True, blank=True)
    etag = models.CharField(max_length=255, null=True, blank=True)
    mime_type = models.CharField(max_length=50, blank=True)
    size = models.PositiveIntegerField(blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, blank=True)

    class Meta:
        db_table = "attachments"
        verbose_name_plural = "Attachments"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.url}"


class Make(UUIDPrimaryKey):
    name = models.CharField(max_length=255)
    estb_year = models.SmallIntegerField(null=True, blank=True)
    code = models.CharField(max_length=3, unique=True)

    class Meta:
        db_table = "makes"

    def __str__(self):
        return f"{self.name}"


class VehicleType(UUIDPrimaryKey):
    name = models.CharField(max_length=255)
    category = models.CharField(
        max_length=3,
        choices=VehicleCategories.choices,
    )
    code = models.CharField(max_length=3, unique=True)

    class Meta:
        db_table = "vehicle_types"

    def __str__(self):
        return f"{self.name}"


class Vehicle(UUIDPrimaryKey):
    make = models.ForeignKey(Make, on_delete=models.CASCADE)
    vehicle_type = models.ForeignKey(VehicleType, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)

    class Meta:
        db_table = "vehicles"

    def __str__(self):
        return f"{self.name} ({self.vehicle_type})"


class Variant(UUIDPrimaryKey):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    launch_date = models.DateField()
    name = models.CharField(max_length=255, db_index=True)
    slug = models.CharField(max_length=255, unique=True, editable=False)
    fuel_type = models.CharField(max_length=2, choices=FluelTypes.choices)
    transmission = models.CharField(
        max_length=6,
        choices=TransmissionTypes.choices,
        default=TransmissionTypes.MANUAL.value,
        db_default=TransmissionTypes.MANUAL.value,
    )  # type: ignore
    description = models.TextField()
    short_description = models.TextField(null=True, blank=True)
    specifications = models.JSONField(
        null=True, blank=True, default=dict, db_default=str({})
    )  # type: ignore

    attachments = models.ManyToManyField(Attachment, blank=True)
    manufacturer_link = models.URLField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = "variants"

    def __str__(self):
        return f"{self.name}"


class VariantColor(UUIDPrimaryKey):
    variant = models.ForeignKey(Variant, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    hex_code = models.CharField(max_length=7, null=True, blank=True)
    attachments = models.ManyToManyField(Attachment, blank=True)

    class Meta:
        db_table = "variant_colors"
        unique_together = ["variant", "name"]

    def __str__(self):
        return f"{self.name}"


class PriceItem(UUIDPrimaryKey, AbstractTimestamp):
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    category = models.CharField(max_length=3, choices=PriceCategoryTypes.choices)
    type = models.CharField(max_length=2, choices=TransactionTypes.choices)
    serial_no = models.PositiveSmallIntegerField(default=1, db_default=1)  # type: ignore

    def __str__(self) -> str:
        return f"{self.name} - {self.type}"

    class Meta:
        db_table = "price_items"


class Contribution(UUIDPrimaryKey, AbstractTimestamp):
    status = models.CharField(
        max_length=2,
        choices=ContributionStatus.choices,
        default=ContributionStatus.PENDING.value,
        db_default=ContributionStatus.PENDING.value,
    )  # type: ignore
    variant = models.ForeignKey(Variant, on_delete=models.CASCADE)
    color = models.ForeignKey(
        VariantColor, on_delete=models.CASCADE, null=True, blank=True
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    city = models.ForeignKey(City, on_delete=models.CASCADE)

    quoted_on = models.DateField()
    dealership_name = models.CharField(max_length=255)

    total = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=decimal.Decimal(0),
        db_default=decimal.Decimal(0),
    )  # type: ignore
    attachments = models.ManyToManyField(Attachment, blank=True)
    upvotes = models.IntegerField(
        default=decimal.Decimal(0),
        db_default=decimal.Decimal(0),
    )  # type: ignore
    downvotes = models.IntegerField(
        default=decimal.Decimal(0),
        db_default=decimal.Decimal(0),
    )  # type: ignore
    remark = models.TextField(null=True, blank=True)

    class Meta:
        db_table = "contributions"

    def __str__(self):
        return f"{self.variant}/{self.quoted_on}/{self.city}/{self.total}"


class ContributionPriceItem(UUIDPrimaryKey, AbstractTimestamp):
    serial_no = models.PositiveSmallIntegerField(default=1, db_default=1)  # type: ignore
    contribution = models.ForeignKey(Contribution, on_delete=models.CASCADE)
    price_item = models.ForeignKey(PriceItem, on_delete=models.CASCADE)
    value = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = "contribution_price_items"
        constraints = [
            models.CheckConstraint(
                check=models.Q(value__gte="0"), name="contribution_value_non_negative"
            ),
            models.UniqueConstraint(
                fields=["contribution", "serial_no"],
                name="contribution_serial_no_unique",
            ),
            models.UniqueConstraint(
                fields=["contribution", "price_item"],
                name="contribution_price_item_unique",
            ),
        ]


class Vote(UUIDPrimaryKey, AbstractTimestamp):
    contribution = models.ForeignKey(Contribution, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    type = models.CharField(max_length=2, choices=VoteTypes.choices)

    class Meta:
        db_table = "votes"
        unique_together = ["contribution", "user"]

    def __str__(self):
        return f"{self.contribution}/{self.user}/{self.type}"
