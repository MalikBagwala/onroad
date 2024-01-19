from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import redirect
from . import models
from django.conf import settings
from django_dramatiq.admin import TaskAdmin
from django_dramatiq.models import Task
# Register your models here.
UserAdmin.fieldsets += (("Extra Fields", {"fields": ("city", "email_verified")}),)  # type: ignore


class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = models.User
        fields = UserCreationForm.Meta.fields + ("email",)  # type: ignore


@admin.register(models.User)
class UserAdmin(UserAdmin, ImportExportModelAdmin):
    add_form = CustomUserCreationForm
    actions = ("mark_email_verified", "login_as_user")
    ordering = ("-date_joined",)
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("username", "email", "password1", "password2"),
            },
        ),
    )
    search_fields = (
        "username",
        "email",
        "first_name",
        "last_name",
    )
    list_filter = ("city__name", "is_staff", "email_verified")
    list_display = (
        "username",
        "email",
        "first_name",
        "last_name",
        "is_staff",
        "email_verified",
        "city",
    )

    @admin.action(description="Mark email verified")
    def mark_email_verified(self, _, queryset):
        queryset.update(email_verified=True)

    @admin.action(description="Login as user")
    def login_as_user(self, _, queryset):
        if queryset.count != 1:
            return
        tokens = queryset.first().get_tokens()
        url = f"https://{settings.DOMAIN_NAME}?access={tokens["accessToken"]}&refresh={tokens["refreshToken"]}"  # type: ignore
        return redirect(url)

    pass


@admin.register(models.PasswordChangeRequest)
class PasswordChangeRequestAdmin(ImportExportModelAdmin):
    search_fields = ("user__username",)
    list_display = ("id", "user", "expires_at", "used")
    pass

@admin.register(models.Attachment)
class AttachmentAdmin(ImportExportModelAdmin):
    search_fields = ("file",)
    list_filter = ("mime_type",)
    pass

@admin.register(models.Country)
class CountryAdmin(ImportExportModelAdmin):
    pass


@admin.register(models.State)
class StateAdmin(ImportExportModelAdmin):
    search_fields = ("name", "code")
    pass


@admin.register(models.City)
class CityAdmin(ImportExportModelAdmin):
    list_display = ("name", "code", "state")
    search_fields = ("name", "code")
    list_filter = ("state__name", "state__country__name")
    pass


@admin.register(models.Make)
class MakeAdmin(ImportExportModelAdmin):
    search_fields = ("name",)
    list_display = ("name", "estb_year")
    pass


@admin.register(models.VehicleType)
class VehicleTypeAdmin(ImportExportModelAdmin):
    search_fields = ("name",)
    list_filter = ("category",)
    pass


@admin.register(models.Vehicle)
class VehicleAdmin(ImportExportModelAdmin):
    search_fields = ("name",)
    list_filter = ("make__name","vehicle_type__name",)
    pass


@admin.register(models.Variant)
class VariantAdmin(ImportExportModelAdmin):
    search_fields = ("name",)
    autocomplete_fields = ("vehicle",)
    
    pass


@admin.register(models.VariantColor)
class VariantColorAdmin(ImportExportModelAdmin):
    search_fields = ("name", "hex_code")
    list_display = ("variant", "name", "hex_code")
    list_filter = ("variant__name",)
    pass


@admin.register(models.PriceItem)
class PriceItemAdmin(ImportExportModelAdmin):
    search_fields = ("name",)
    list_display = ("name", "description","category","type")
    list_filter = ("category",)
    pass

@admin.register(models.Contribution)
class ContributionAdmin(ImportExportModelAdmin):
    search_fields = ("variant__name", "city__name")
    list_display = ("user", "variant", "color", "city", "total", "upvotes", "downvotes")
    list_filter = ("variant__name", "city__name")
    autocomplete_fields = ("user", "color", "variant", "city")
    pass

@admin.register(models.ContributionPriceItem)
class ContributionPriceItemAdmin(ImportExportModelAdmin):
    search_fields = ("contribution__variant__name", "price_item__name")
    list_display = ("serial_no", "contribution", "price_item", "value")
    list_filter = ("contribution__variant__name", "price_item__name")
    autocomplete_fields = ("contribution", "price_item")
    pass

@admin.register(models.Vote)
class VotesAdmin(ImportExportModelAdmin):
    pass


@admin.register(models.Otp)
class OtpAdmin(ImportExportModelAdmin):
    search_fields = ("user__username", "otp")
    list_display = ("user", "otp", "expires_at", "used")
    pass

admin.site.unregister(Task)
@admin.register(Task)
class CustomTaskAdmin(TaskAdmin):
    list_display = (
        "actor_name",
        "status",
        "eta",
        "queue_name",
        "created_at",
        "updated_at",
    )
    pass
