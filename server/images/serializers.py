from rest_framework import serializers
from .models import Label

class LabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Label
        fields = ['id', 'name']

class FileDirectUploadStartSerializer(serializers.Serializer):
    file_name = serializers.CharField()
    file_type = serializers.CharField()

class FileDirectUploadFinishSerializer(serializers.Serializer):
    file_id = serializers.CharField()
