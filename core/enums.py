from django.utils.translation import gettext_lazy as _
from django.db import models


class FluelTypes(models.TextChoices):
    PETROL = "PT", _("Petrol")
    DIESEL = "DL", _("Diesel")
    CNG = "CG", _("CNG")
    ELECTRIC = "EL", _("Electric")
    HYBRID = "HB", _("Hybrid")


class TransmissionTypes(models.TextChoices):
    MANUAL = "MT", _("Manual Transmission")
    SMT = "SMT", _("Sequential Manual Transmission")
    AMT = "AMT", _("Automated Manual Transmission")
    AT = "AT", _("Traditional Automatic Transmission")
    DCT = "DCT", _("Dual-Clutch Transmission")
    CVT = "CVT", _("Continuously Variable Transmission")
    SEMI_AUTOMATIC = "S-A", _("Semi-Automatic Transmission")
    CVT_WITH_TORQUE_CONVERTER = "CVT-TC", _("CVT with Torque Converter")
    DSG = "DSG", _("Direct-Shift Gearbox")
    POWER_SPLIT_HYBRID = "PSH", _("Power Split Hybrid Transmission")
    E_CVT = "E-CVT", _("Electronic Continuously Variable Transmission")
    AUTOMATED_SEQUENTIAL = "ASG", _("Automated Sequential Gearbox")
    HYDROSTATIC = "HST", _("Hydrostatic Transmission")
    IVT = "IVT", _("Infinitely Variable Transmission")


class VehicleCategories(models.TextChoices):
    SEDAN = "SED", _("Sedan")
    SUV = "SUV", _("SUV")
    CROSSOVER = "CRS", _("Crossover")
    HATCHBACK = "HAT", _("Hatchback")
    PICKUP = "PCK", _("Pickup Truck")
    MOTORCYCLE = "MTC", _("Motorcycle")
    VAN = "VAN", _("Van")
    CONVERTIBLE = "CON", _("Convertible")
    ATV = "ATV", _("ATV")
    BICYCLE = "BIC", _("Bicycle")
    MOPED = "MO", _("Moped")


class OtpTypes(models.TextChoices):
    EMAIL = "EM", _("Email")
    PHONE = "PH", _("Phone")


class VoteTypes(models.TextChoices):
    UPVOTE = "UP", _("Upvote")
    DOWNVOTE = "DN", _("Downvote")


class PriceCategoryTypes(models.TextChoices):
    EX_SHOWROOM_PRICE = "EX", _("Ex-Showroom Price")
    TCS = "TCS", _("Tax Collected at Source")
    RTO = "RTO", _("Regional Transport Office")
    INSURANCE = "IN", _("Insurance")
    EXTENDED_WARRANTY = "EW", _("Extended Warranty")
    BASIC_KIT = "BK", _("Basic Kit")
    FAST_TAG = "FT", _("Fast Tag")
    LOCAL_BODY_TAXES = "LBT", _("Local Body Taxes")
    OTHER_ACCESSORIES = "OA", _("Other Accessories")
    CONSUMER_PROMOTION = "CP", _("Consumer Promotion")
    MISCELLANEOUS = "MI", _("Miscellaneous")
    DISCOUNT = "DI", _("Discount")
    SUBSIDY = "SU", _("Subsidy")


class TransactionTypes(models.TextChoices):
    CREDIT = "CR", _("Credit")
    DEBIT = "DB", _("Debit")


class ContributionStatus(models.TextChoices):
    PENDING = "PD", _("Pending")
    ACCEPTED = "AC", _("Accepted")
    REJECTED = "RJ", _("Rejected")


class AuthProvider(models.TextChoices):
    ONROAD = "OR", _("Onroad")
    GOOGLE = "GO", _("Google")
    APPLE = "AP", _("Apple")
