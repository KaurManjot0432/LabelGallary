from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from .aws_integration import s3_generate_presigned_get
from .models import File
from .services import (
    FileDirectUploadService
)
from .pagination import CustomPagination


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
        try:
            images = File.objects.all()
            image_list = []

            for image in images:
                image_data = {
                    'id': str(image.id),
                    'file_name': image.file_name,
                    'file_type': image.file_type,
                    'presigned_url': s3_generate_presigned_get(str(image.file)),
                }
                image_list.append(image_data)

            paginator = CustomPagination()
            result_page = paginator.paginate_queryset(image_list, request)
            return paginator.get_paginated_response(result_page)

        except Exception as e:
            return Response({
                'success': False,
                'error': str(e),
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

