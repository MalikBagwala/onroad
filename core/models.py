import decimal
from django.contrib.auth.models import AbstractUser

from core.utils.time import (
    get_otp_expires_at,
    get_password_change_request_expires_at,
    get_refresh_token_expires_in,
)
from .abstracts import AbstractTimestamp, UUIDPrimaryKey
from django.db import models
from .utils.random import generate_otp
from django.utils import timezone
from .enums import (
    PriceCategoryTypes,
    TransactionTypes,
    VoteTypes,
    OtpTypes,
    VehicleCategories,
    TransmissionTypes,
    FluelTypes,
    ContributionStatus,
)
from io import BytesIO
import sys
from PIL import Image
from django.core.files.uploadedfile import InMemoryUploadedFile
from .utils import jwt
import mimetypes
from uuid import uuid4

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
        return self.name


class User(AbstractUser, AbstractTimestamp, UUIDPrimaryKey):
    email = models.EmailField(unique=True)
    city = models.ForeignKey(City, on_delete=models.CASCADE, null=True, blank=True)
    email_verified = models.BooleanField(default=False)
    has_contributed = models.BooleanField(default=False)

    class Meta:
        db_table = "users"

    def get_access_token(self):
        return jwt.get_access_token(self)

    def get_refresh_token(self, client="web"):
        try:
            token_instance, _ = RefreshToken.objects.get_or_create(
                user=self, client=client, expires_at__gt=timezone.now()
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

    def __str__(self):
        if self.first_name:
            return f"{self.first_name} {self.last_name}"
        else:
            return self.username

    pass


def custom_filename(instance, filename):
    """
    Generate a unique filename for the uploaded image.
    """
    # Get the file extension
    ext = filename.split(".")[-1]
    # Generate a unique filename using UUID4
    new_filename = f"{instance.pk}.{ext}"
    # Return the new filename
    return new_filename


class Attachment(UUIDPrimaryKey):
    file = models.FileField()
    mime_type = models.CharField(max_length=50, blank=True)
    size = models.PositiveIntegerField(blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)

    def save(self):
        mt = mimetypes.guess_type(self.file.name)
        if mt[0] and mt[0].startswith("image"):
            im = Image.open(self.file)
            output = BytesIO()
            # after modifications, save it to the output
            im.save(output, format="WEBP", quality=80)
            output.seek(0)

            self.size = sys.getsizeof(output)
            self.mime_type = "image/webp"
            # change the imagefield value to be the newley modifed image value
            self.file = InMemoryUploadedFile(
                output,
                "ImageField",
                f"{self.pk}.webp",
                self.mime_type,
                self.size,
                None,
            )
        else:
            self.mime_type = mt[0]
            self.size = self.file.size
            self.file.name = custom_filename(self, self.file.name)
            pass

        super(Attachment, self).save()

    class Meta:
        db_table = "attachments"
        verbose_name_plural = "Attachments"

    def __str__(self):
        return f"{self.file}"


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

    def __str__(self) -> str:
        return f"{self.name} - {self.type}"

    class Meta:
        db_table = "price_items"


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

    total = models.DecimalField(
        max_digits=10, decimal_places=2, default=decimal.Decimal(0)
    )
    attachments = models.ManyToManyField(Attachment, blank=True)
    upvotes = models.IntegerField(default=0)
    downvotes = models.IntegerField(default=0)
    remark = models.TextField(null=True, blank=True)

    class Meta:
        db_table = "contributions"

    def __str__(self):
        return f"{self.variant}/{self.quoted_on}/{self.city}/{self.total}"


class ContributionPriceItem(UUIDPrimaryKey, AbstractTimestamp):
    serial_no = models.PositiveSmallIntegerField(default=1)
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


class RefreshToken(UUIDPrimaryKey, AbstractTimestamp):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.UUIDField(default=uuid4)
    expires_at = models.DateTimeField(default=get_refresh_token_expires_in)
    client = models.CharField(max_length=255, default="web")

    class Meta:
        db_table = "refresh_tokens"
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["user", "client"],
                condition=models.Q(expires_at__gt=timezone.now()),
                name="unique_user_client_refresh_token",
            ),
        ]

    def __str__(self):
        return f"{self.user} - {self.expires_at}"

    pass
