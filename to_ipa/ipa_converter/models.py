from django.db import models

class NarrowIPA(models.Model):
    word = models.CharField(max_length=200)
    transcription1 = models.TextField()
    transcription2 = models.TextField()
    transcription3 = models.TextField()
    transcription4 = models.TextField()

class BroadIPA(models.Model):
    word = models.CharField(max_length=200)
    transcription1 = models.TextField()
    transcription2 = models.TextField()
    transcription3 = models.TextField()
    transcription4 = models.TextField()
