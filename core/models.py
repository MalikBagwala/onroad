import decimal
from django.contrib.auth.models import AbstractUser

from core.utils.time import get_otp_expires_at, get_password_change_request_expires_at
from .abstracts import AbstractTimestamp, UUIDPrimaryKey
from django.db import models
from .utils.random import generate_otp
from django.utils import timezone
from .enums import (
    VoteTypes,
    OtpTypes,
    VehicleCategories,
    TransmissionTypes,
    FluelTypes,
    ContributionStatus,
)

from .utils import jwt

# Create your models here.


class Country(UUIDPrimaryKey):
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = "countries"
        verbose_name_plural = "Countries"

    def __str__(self):
        return f"{self.name} ({self.code})"


class State(UUIDPrimaryKey):
    country = models.ForeignKey(Country, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = "states"

    def __str__(self):
        return f"{self.name} ({self.code})"


class City(UUIDPrimaryKey):
    state = models.ForeignKey(State, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = "cities"
        verbose_name_plural = "Cities"

    def __str__(self):
        return f"{self.name} ({self.code})"


class User(AbstractUser, AbstractTimestamp, UUIDPrimaryKey):
    email = models.EmailField(unique=True)
    city = models.ForeignKey(City, on_delete=models.CASCADE, null=True, blank=True)
    email_verified = models.BooleanField(default=False)

    class Meta:
        db_table = "users"

    def get_tokens(self):
        return {
            "refreshToken": jwt.get_auth_token(self, 1440, "refresh"),
            "accessToken": jwt.get_auth_token(self, 1440, "access"),  # type: ignore
        }

    def __str__(self):
        if self.first_name:
            return f"{self.first_name} {self.last_name}"
        else:
            return self.username

    pass


class Media(UUIDPrimaryKey):
    url = models.URLField(max_length=255)
    mime_type = models.CharField(max_length=255)
    etag = models.CharField(max_length=255)
    size = models.IntegerField()
    bucket = models.CharField(max_length=255)
    key = models.CharField(max_length=255)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, editable=False)

    class Meta:
        db_table = "media"
        verbose_name_plural = "Media"

    def __str__(self):
        return f"{self.url}"


class Make(UUIDPrimaryKey):
    name = models.CharField(max_length=255)
    estb_year = models.SmallIntegerField(null=True, blank=True)

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
    name = models.CharField(max_length=255)
    fuel_type = models.CharField(max_length=2, choices=FluelTypes.choices)
    transmission = models.CharField(
        max_length=6,
        choices=TransmissionTypes.choices,
        default=TransmissionTypes.MANUAL.value,
    )
    description = models.TextField()
    specifications = models.JSONField(null=True, blank=True, default=dict)
    attachments = models.ManyToManyField(Media, blank=True)
    manufacturer_link = models.URLField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = "variants"

    def __str__(self):
        return f"{self.name}"


class VariantColor(UUIDPrimaryKey):
    variant = models.ForeignKey(Variant, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    hex_code = models.CharField(max_length=7, null=True, blank=True)
    attachments = models.ManyToManyField(Media, blank=True)

    class Meta:
        db_table = "variant_colors"
        unique_together = ["variant", "name"]

    def __str__(self):
        return f"{self.name}"


class Contribution(UUIDPrimaryKey, AbstractTimestamp):
    status = models.CharField(
        max_length=2,
        choices=ContributionStatus.choices,
        default=ContributionStatus.PENDING.value,
    )
    variant = models.ForeignKey(Variant, on_delete=models.CASCADE)
    color = models.ForeignKey(
        VariantColor, on_delete=models.CASCADE, null=True, blank=True
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    city = models.ForeignKey(City, on_delete=models.CASCADE)

    quoted_on = models.DateField()
    dealership_name = models.CharField(max_length=255)
    ex_showroom = models.DecimalField(max_digits=10, decimal_places=2)
    rto = models.DecimalField(max_digits=10, decimal_places=2)
    insurance = models.DecimalField(
        max_digits=10, decimal_places=2, default=decimal.Decimal(0)
    )
    accessories = models.DecimalField(
        max_digits=10, decimal_places=2, default=decimal.Decimal(0)
    )
    subsidies = models.DecimalField(
        max_digits=10, decimal_places=2, default=decimal.Decimal(0)
    )
    misc = models.DecimalField(
        max_digits=10, decimal_places=2, default=decimal.Decimal(0)
    )
    total = models.DecimalField(
        max_digits=10, decimal_places=2, default=decimal.Decimal(0)
    )
    metadata = models.JSONField(null=True, blank=True, default=dict)
    attachments = models.ManyToManyField(Media, blank=True)
    upvotes = models.IntegerField(default=0)
    downvotes = models.IntegerField(default=0)
    remark = models.TextField(null=True, blank=True)

    def update_total(self):
        self.total = (
            self.ex_showroom
            + self.rto
            + self.insurance
            + self.accessories
            - self.subsidies
            + self.misc
        )
        self.save()

    def upvote(self, trigger_save=True):
        self.upvotes = max(0, self.upvotes + 1)
        if trigger_save:
            self.save()

    def downvote(self, trigger_save=True):
        self.downvotes = max(0, self.downvotes + 1)
        if trigger_save:
            self.save()

    class Meta:
        db_table = "contributions"

    def __str__(self):
        return f"{self.variant}/{self.quoted_on}/{self.city}/{self.total}"


class Vote(UUIDPrimaryKey, AbstractTimestamp):
    contribution = models.ForeignKey(Contribution, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    type = models.CharField(max_length=2, choices=VoteTypes.choices)

    class Meta:
        db_table = "votes"
        unique_together = ["contribution", "user"]

    def __str__(self):
        return f"{self.contribution}/{self.user}/{self.type}"


class Otp(UUIDPrimaryKey, AbstractTimestamp):
    otp = models.CharField(max_length=6, default=generate_otp)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    expires_at = models.DateTimeField(default=get_otp_expires_at)
    used = models.BooleanField(default=False)
    type = models.CharField(
        max_length=2, choices=OtpTypes.choices, default=OtpTypes.EMAIL.value
    )

    class Meta:
        db_table = "otps"
        unique_together = ["otp", "user", "expires_at", "type"]
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.otp} ({self.user})"

    @property
    def is_expired(self):
        return timezone.now() > self.expires_at


class PasswordChangeRequest(UUIDPrimaryKey, AbstractTimestamp):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    expires_at = models.DateTimeField(default=get_password_change_request_expires_at)
    used = models.BooleanField(default=False)

    class Meta:
        db_table = "password_change_requests"
        verbose_name_plural = "Password Change Requests"
        unique_together = ["user", "expires_at"]
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.user} - {self.expires_at}"

    @property
    def is_expired(self):
        return timezone.now() > self.expires_at
