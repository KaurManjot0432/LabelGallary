from django.shortcuts import render
from .models import Label
from .serializers import LabelSerializers
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser


@api_view(['GET'])
def api(request, pk=None):
    if request.method== 'GET':
        labels = Label.objects.all()
        label_serializer = LabelSerializers(labels, many=True)
        return JsonResponse(label_serializer.data, safe=False)