from django.urls import path
from .views import RetrieveNarrowIPA, RetrieveBroadIPA, GetNarrowIPA, GetBroadIPA
from django.views.generic import TemplateView


urlpatterns = [
    path('', TemplateView.as_view(template_name='index.html'), name='index'),
    path('about/', TemplateView.as_view(template_name="about.html"), name="about"),
    path('narrow-ipa-api/<str:word>', RetrieveNarrowIPA.as_view(), name="narrow-ipa-api"),
    path('broad-ipa-api/<str:word>', RetrieveBroadIPA.as_view(), name="broad-ipa-api"),
    path('narrow-ipa-api', GetNarrowIPA.as_view(), name="narrow-ipa"),
    path('broad-ipa-api', GetBroadIPA.as_view(), name="broad-ipa"),
]