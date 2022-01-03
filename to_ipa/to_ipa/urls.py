from django.urls import path, include

urlpatterns = [
    path("", include("ipa_converter.urls")),
]
