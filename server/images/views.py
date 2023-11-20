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
            images = File.objects.all()
            image_list = []

            for image in images:
                image_data = {
                    'id': str(image.id),
                    'file_name': image.original_file_name,
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

    def post(self, request, pk):
        """
        Add a label to an existing image.
        """
        try:
            file = self.get_object()
            label_name = request.data.get('label_name')
            
            if not label_name:
                return Response({'error': 'Label name is required.'}, status=status.HTTP_400_BAD_REQUEST)

            label, created = Label.objects.get_or_create(name=label_name)
            file.labels.add(label)
            file.save()

            return Response({'success': True, 'message': f'Label "{label_name}" added to the image.'})
        except File.DoesNotExist:
            return Response({'error': 'Image does not exist.'}, status=status.HTTP_404_NOT_FOUND)
