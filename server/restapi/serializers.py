from rest_framework import serializers
from .models import Label

class LabelSerializers(serializers.ModelSerializer):
    class Meta:
        model = Label
        fields = ['name']