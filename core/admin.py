from uuid import uuid4
from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import redirect

from core.utils.s3 import upload_file_obj
from . import models
from django_dramatiq.admin import TaskAdmin
from django_dramatiq.models import Task
from django import forms


# Register your models here.
UserAdmin.fieldsets += (("Extra Fields", {"fields": ("city", "email_verified", "has_contributed", "google_id", "avatar")}),)  # type: ignore


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
        if queryset.count() != 1:
            return
        link = queryset.first().get_login_link(True)
        return redirect(link)

    pass


@admin.register(models.UserToken)
class UserTokenAdmin(ImportExportModelAdmin):
    search_fields = ("user__username", "token")
    list_display = ("user", "token", "type", "expires_at", "used")
    list_filter = ("type", "used")


class AttachmentAdminForm(forms.ModelForm):
    file = forms.FileField(label="Upload File")

    class Meta:
        model = models.Attachment
        fields = "__all__"


@admin.register(models.UserPassKeys)
class UserPassKeysAdmin(ImportExportModelAdmin):
    search_fields = (
        "description",
        "name",
    )
    list_display = (
        "name",
        "description",
        "created_at",
        "credential_id",
        "public_key",
        "updated_at",
    )
    pass


@admin.register(models.Attachment)
class AttachmentAdmin(ImportExportModelAdmin):
    form = AttachmentAdminForm
    search_fields = ("url",)
    list_filter = ("mime_type",)

    def save_model(self, request, obj, form, change):
        # Get the uploaded file from the form
        uploaded_file = form.cleaned_data.get("file")
        media_id = obj.id or uuid4()
        response = upload_file_obj(uploaded_file, media_id=media_id, create_media=False)
        if response:
            obj.url = response["url"]  # type: ignore
            obj.key = response["key"]  # type: ignore
            obj.created_by = request.user
            obj.mime_type = response["mime_type"]  # type: ignore
            obj.size = response["size"]  # type: ignore
            obj.etag = response["etag"]  # type: ignore
            obj.save()
            return

        # Call the parent save_model method to save the other fields
        super().save_model(request, obj, form, change)

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
    list_display = ("name", "code", "estb_year")
    pass


@admin.register(models.VehicleType)
class VehicleTypeAdmin(ImportExportModelAdmin):
    search_fields = ("name",)
    list_filter = ("category",)
    list_display = ("name", "category", "code")
    pass


@admin.register(models.Vehicle)
class VehicleAdmin(ImportExportModelAdmin):
    search_fields = ("name",)
    list_filter = (
        "make__name",
        "vehicle_type__name",
    )
    pass


@admin.register(models.Variant)
class VariantAdmin(ImportExportModelAdmin):
    list_display = ("name", "slug", "fuel_type", "transmission")
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
    list_display = ("name", "serial_no", "description", "category", "type")
    ordering = ("serial_no",)
    list_filter = ("category",)
    pass


@admin.register(models.Contribution)
class ContributionAdmin(ImportExportModelAdmin):
    search_fields = ("variant__name", "city__name")
    list_display = (
        "user",
        "variant",
        "color",
        "city",
        "total",
        "upvotes",
        "downvotes",
        "status",
    )
    list_filter = ("variant__name", "city__name")
    autocomplete_fields = ("user", "color", "variant", "city")
    actions = (
        "accept_contributions",
        "reject_contributions",
        "mark_contributions_as_pending",
    )

    @admin.action(description="✅ Accept Contributions")
    def accept_contributions(self, _, queryset):
        queryset.update(status=models.ContributionStatus.ACCEPTED)

    @admin.action(description="❌ Reject Contributions")
    def reject_contributions(self, _, queryset):
        queryset.update(status=models.ContributionStatus.REJECTED)

    @admin.action(description="⏱️ Mark Contributions as Pending")
    def mark_contributions_as_pending(self, _, queryset):
        queryset.update(status=models.ContributionStatus.PENDING)

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
