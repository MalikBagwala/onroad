"""
URL configuration for onroad project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from strawberry.django.views import GraphQLView
from django.contrib import admin
from django.urls import path
from django.shortcuts import redirect
from core.views import (
    verify_otp,
)
from core.schema import schema

admin.site.site_header = "Onroad Admin"

urlpatterns = [
    path("api/", lambda _: redirect("/api/admin/", permanent=False)),
    path("api/admin/", admin.site.urls),
    path("api/verify/otp/<str:user_id>/<str:otp>/", verify_otp, name="verify_otp"),
    path("api/graphql/", GraphQLView.as_view(schema=schema)),
]
