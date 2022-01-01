from django.urls import path, include

urlpatterns = [
    path("english_to_ipa", include("english_to_ipa.urls")),
]
