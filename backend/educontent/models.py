from django.db import models
from subscriptions.models import Tier
from django.core.files.storage import FileSystemStorage
from django.conf import settings
import os
import uuid
from django.utils import timezone

# Define storage locations
public_storage = FileSystemStorage(location=os.path.join(settings.MEDIA_ROOT, "public"),
                                   base_url="/media/public/")

private_storage = FileSystemStorage(location=os.path.join(settings.MEDIA_ROOT, "private"),
                                    base_url="/media/private/")

def upload_to_private(instance, filename):
    ext = filename.split('.')[-1]  # file extension
    now = timezone.now()
    filename = f"{uuid.uuid4().hex}.{ext}"
    return f"private/uploads/{now:%Y/%m/%d}/{filename}"

# Create your models here.
class EducationalContent(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    tier = models.ForeignKey(Tier, on_delete=models.PROTECT,null=False)
    # Public file accessible to everyone
    # file_public = models.FileField(storage=public_storage, upload_to="uploads/%Y/%m/%d/", blank=True, null=True)
    
    # Private file, only served via view
    file = models.FileField(upload_to=upload_to_private, blank=True, null=True)
    
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title