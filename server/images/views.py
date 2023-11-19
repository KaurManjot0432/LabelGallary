from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import File
from .services import (
    FileDirectUploadService
)



class FileDirectUploadStartApi(APIView):
    class InputSerializer(serializers.Serializer):
        file_name = serializers.CharField()
        file_type = serializers.CharField()

    def post(self, request, *args, **kwargs):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        service = FileDirectUploadService(request.user)
        presigned_data = service.start(**serializer.validated_data)

        return Response(data=presigned_data)


class FileDirectUploadFinishApi(APIView):
    class InputSerializer(serializers.Serializer):
        file_id = serializers.CharField()

    def post(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        file_id = serializer.validated_data["file_id"]

        file = get_object_or_404(File, id=file_id)

        service = FileDirectUploadService(request.user)
        service.finish(file=file)

        return Response({"id": file.id})


class ImageListView(APIView):
    def get(self, request, *args, **kwargs):
        images = File.objects.all()
        image_list = []

        for image in images:
            image_data = {
                'id': str(image.id),
                'file_name': image.file_name,
                'file_type': image.file_type,
                's3_url': f'https://labelgallary.s3.amazonaws.com/{image.file}',
            }
            image_list.append(image_data)

        return Response({
                'success': True,
                'images': image_list,
            }, status=status.HTTP_200_OK)
