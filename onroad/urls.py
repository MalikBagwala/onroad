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


from django.contrib import admin
from django.urls import path
from django.shortcuts import redirect
from core.views import google_oauth, upload_file
from core.schema import schema
from core.api_views import JWTAuthGraphQLView

admin.site.site_header = "Onroad Admin"

urlpatterns = [
    path("api/", lambda _: redirect("/api/admin/", permanent=False)),
    path("api/admin/", admin.site.urls),
    path("api/graphql/", JWTAuthGraphQLView.as_view(schema=schema)),
    path("api/oauth", google_oauth, name="google_oauth"),
    path("api/upload", upload_file, name="upload_file"),
]
