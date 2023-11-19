from django.conf import settings
from django.db import transaction
from django.utils import timezone
from .models import File, file_generate_upload_path
from .aws_integration import s3_generate_presigned_post 
import pathlib
from uuid import uuid4
from accounts.models import CustomUser

class FileDirectUploadService:
    def __init__(self, user: CustomUser):
        self.user = user
    @transaction.atomic
    def start(self, *, file_name: str, file_type: str):
        file = File(
            original_file_name=file_name,
            file_name=file_generate_name(file_name),
            file_type=file_type,
            file=None
        )
        file.full_clean()
        file.save()

        upload_path = file_generate_upload_path(file, file.file_name)

        """
        We are doing this in order to have an associated file for the field.
        """
        file.file = file.file.field.attr_class(file, file.file.field, upload_path)
        file.save()

        presigned_data = {}

        presigned_data = s3_generate_presigned_post(file_path=upload_path, file_type=file.file_type)

        return {"id": file.id, **presigned_data}

    @transaction.atomic
    def finish(self, *, file: File) -> File:
        file.upload_finished_at = timezone.now()
        file.full_clean()
        file.save()

        return file

def file_generate_name(original_file_name):
    extension = pathlib.Path(original_file_name).suffix

    return f"{uuid4().hex}{extension}"