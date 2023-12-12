from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from .aws_integration import s3_generate_presigned_get
from .models import File, Label
from django.contrib.auth.models import AnonymousUser
from .services import (
    FileDirectUploadService
)
from .pagination import CustomPagination
from .serializers import (
    LabelSerializer, 
    FileDirectUploadStartSerializer, 
    FileDirectUploadFinishSerializer
)


class FileDirectUploadStartApi(APIView):

    def post(self, request, *args, **kwargs):
        try:
            if request.user.is_anonymous:
                return Response({
                    'success': False,
                    'error': 'Authentication failed',
                }, status=status.HTTP_401_UNAUTHORIZED)
            
            user_fields = str(request.user).split('$')
            user_role = user_fields[2]

            if(user_role != 'Admin'):
                return Response({
                    'success': False,
                    'error': 'Authentication failed',
                }, status=status.HTTP_401_UNAUTHORIZED)
            
            serializer = FileDirectUploadStartSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            service = FileDirectUploadService(request.user)
            presigned_data = service.start(**serializer.validated_data)

            return Response(data=presigned_data)
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e),
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class FileDirectUploadFinishApi(APIView):

    def post(self, request):
        try:
            serializer = FileDirectUploadFinishSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            file_id = serializer.validated_data["file_id"]

            file = get_object_or_404(File, id=file_id)

            service = FileDirectUploadService(request.user)
            service.finish(file=file)

            return Response({"id": file.id})
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e),
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ImageListApi(APIView):
    def get(self, request, *args, **kwargs):
        try:
            label_name = request.query_params.get('label', 'all')

             # Get images based on the label or all images if label is not specified
            if label_name == 'all':
                images = File.objects.all()
            else:
                # Fetch images associated with the specified label name
                images = File.objects.filter(labels__name=label_name)

            image_list = []

            for image in images:
                # Fetch the label names associated with the image
                label_names = [label.name for label in image.labels.all()]

                image_data = {
                    'id': str(image.id),
                    'file_name': image.original_file_name,
                    'file_type': image.file_type,
                    'presigned_url': s3_generate_presigned_get(str(image.file)),
                    'labels': label_names,  # Add the list of label names to the image_data
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


class LabelListApi(APIView):

    def get(self, request, *args, **kwargs):
        try:
            labels = Label.objects.all()
            labels_data = LabelSerializer(labels, many=True).data
            return Response({
                'success' : True,
                'labels' : labels_data,
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'success': False,
                'error': str(e),
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, *args, **kwargs):
        try:
            if request.user.is_anonymous:
                return Response({
                    'success': False,
                    'error': 'Authentication failed',
                }, status=status.HTTP_401_UNAUTHORIZED)
            
            user_fields = str(request.user).split('$')
            user_role = user_fields[2]

            if(user_role != 'Admin'):
                return Response({
                    'success': False,
                    'error': 'Authentication failed',
                }, status=status.HTTP_401_UNAUTHORIZED)
            
            serializer = LabelSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response({
                'success': True,
                'data': serializer.data,
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e),
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

class AddLabelToImageApi(APIView):
    def patch(self, request, image_id, *args, **kwargs):
        try:
            image = get_object_or_404(File, id=image_id)
            # Assuming the label name is passed in the request body
            label_name = request.data.get('label')

            if not label_name:
                return Response({
                    'success': False,
                    'error': 'Label name is required in the request body.',
                }, status=status.HTTP_400_BAD_REQUEST)

            label, created = Label.objects.get_or_create(name=label_name)
            image.labels.add(label)
            # Fetch the label names associated with the image
            label_names = [label.name for label in image.labels.all()]

            return Response({
                'success': True,
                'labels': label_names,
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'success': False,
                'error': str(e),
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
