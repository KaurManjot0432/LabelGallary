from django.urls import path
from .views import FileDirectUploadStartApi, FileDirectUploadFinishApi

urlpatterns = [
    path('upload-image/start', FileDirectUploadStartApi.as_view(), name='upload-start'),
    path('upload-image/finish', FileDirectUploadFinishApi.as_view(), name='upload-finish'),
]