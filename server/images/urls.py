from django.urls import path
from .views import FileDirectUploadStartApi, FileDirectUploadFinishApi, ImageListView

urlpatterns = [
    path('upload-image/start', FileDirectUploadStartApi.as_view(), name='upload-start'),
    path('upload-image/finish', FileDirectUploadFinishApi.as_view(), name='upload-finish'),
     path('list-images', ImageListView.as_view(), name='image-list'),
]