from django.urls import path
from .views import (
    FileDirectUploadStartApi, 
    FileDirectUploadFinishApi, 
    ImageListApi,
    LabelListApi,
    AddLabelToImageApi,
)

urlpatterns = [
    path('upload-image/start', FileDirectUploadStartApi.as_view(), name='upload-start'),
    path('upload-image/finish', FileDirectUploadFinishApi.as_view(), name='upload-finish'),
    path('list-images', ImageListApi.as_view(), name='image-list'),
    path('label', LabelListApi.as_view(), name='label'),
    path('label-image/<str:image_id>', AddLabelToImageApi.as_view(), name='add-label-to-image'),
]