from django.db import models

class Label(models.Model):
    name = models.CharField(max_length=255, unique=True)
    files = models.ManyToManyField('File', related_name='label_files')

    def __str__(self):
        return self.name

def file_generate_upload_path(instance, filename):
    # Both filename and instance.file_name should have the same values
    return f"files/{instance.file_name}"

class File(models.Model):
    file = models.FileField(
        upload_to=file_generate_upload_path,
        blank=True,
        null=True
    )

    original_file_name = models.TextField()

    file_name = models.CharField(max_length=255, unique=True)
    file_type = models.CharField(max_length=255)

    upload_finished_at = models.DateTimeField(blank=True, null=True)
    labels = models.ManyToManyField(Label, related_name='label_files')

    @property
    def is_valid(self):
        """
        We consider a file "valid" if the the datetime flag has value.
        """
        return bool(self.upload_finished_at)

    @property
    def url(self):
        return self.file.url

    @property
    def label_names(self):
        """
        Returns a list of label names associated with the file.
        """
        return [label.name for label in self.labels.all()]
