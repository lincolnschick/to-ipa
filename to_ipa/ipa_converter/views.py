from rest_framework.views import APIView
from .models import NarrowIPA, BroadIPA
from .serializers import NarrowIPASerializer, BroadIPASerializer
from rest_framework.response import Response
from rest_framework.generics import RetrieveAPIView
from rest_framework import status


class GetNarrowIPA(APIView):
    serializer_class = NarrowIPASerializer
    lookup_url_kwarg = 'text'
    def get(self, request, format=None):
        text = request.GET.get(self.lookup_url_kwarg)
        
        if text is not None:
            text = text.split(" ")
            transcription_string = "["
            
            for i, word in enumerate(text):
                transcriptions = NarrowIPA.objects.filter(word=clean_word(word))
                if word == "":
                    continue
                elif transcriptions.exists():
                    data = NarrowIPASerializer(transcriptions[0]).data
                    transcription_string += format_data(data)
                else:
                    transcription_string += f"({word})"
                if i < len(text) - 1:
                    transcription_string += " "
            transcription_string += "]"
                
            return Response({"transcription": transcription_string}, status=status.HTTP_200_OK)
        
        return Response(status=status.HTTP_400_BAD_REQUEST)


class GetBroadIPA(APIView):
    serializer_class = BroadIPASerializer
    lookup_url_kwarg = 'text'
    def get(self, request, format=None):
        text = request.GET.get(self.lookup_url_kwarg)
        
        if text is not None:
            text = text.split(" ")
            transcription_string = "["
            
            for i, word in enumerate(text):
                transcriptions = BroadIPA.objects.filter(word=clean_word(word))
                if word == "":
                    continue
                elif transcriptions.exists():
                    data = BroadIPASerializer(transcriptions[0]).data
                    transcription_string += format_data(data)
                else:
                    transcription_string += f'"{word}"'
                if i < len(text) - 1:
                    transcription_string += " "
            transcription_string += "]"
                
            return Response({"transcription": transcription_string}, status=status.HTTP_200_OK)
        
        return Response(status=status.HTTP_400_BAD_REQUEST)

def clean_word(word):
    punctuation = [".", "?", '"', ",", "!", ":", "(", ")", "[", "]"]
    for char in punctuation:
        word = word.replace(char, "")
    return word.lower()

def format_data(data):
    formatted_data = f"{data['transcription1']}"
    transcriptions = [data["transcription2"], data["transcription3"], data["transcription4"]]
    for transcription in transcriptions:
        if transcription:
            formatted_data += "/" + transcription 
    return formatted_data

