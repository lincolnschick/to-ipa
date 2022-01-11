from rest_framework.views import APIView
from .models import NarrowIPA, BroadIPA
from .serializers import NarrowIPASerializer, BroadIPASerializer
from rest_framework.response import Response
from rest_framework.generics import RetrieveAPIView, ListAPIView
from rest_framework import status





class RetrieveNarrowIPA(RetrieveAPIView):
    lookup_field = 'word'
    serializer_class = NarrowIPASerializer
    queryset = NarrowIPA.objects.all()
    
class RetrieveBroadIPA(RetrieveAPIView):
    lookup_field = 'word'
    serializer_class = BroadIPASerializer
    queryset = BroadIPA.objects.all()

