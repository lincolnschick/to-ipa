from .models import NarrowIPA, BroadIPA
from rest_framework.serializers import ModelSerializer


class NarrowIPASerializer(ModelSerializer):
    class Meta:
        model = NarrowIPA
        fields = ['word', 'transcription1', 'transcription2', 'transcription3', 'transcription4']


class BroadIPASerializer(ModelSerializer):
    class Meta:
        model = BroadIPA
        fields = ['word', 'transcription1', 'transcription2', 'transcription3', 'transcription4']