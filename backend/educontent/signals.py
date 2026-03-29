# educational_content/signals.py
from django.db.models.signals import pre_save, post_delete
from django.dispatch import receiver
from .models import EducationalContent
import os

@receiver(pre_save, sender=EducationalContent)
def delete_old_file_on_update(sender, instance, **kwargs):
    if not instance.pk:
        return
    try:
        old_file = sender.objects.get(pk=instance.pk).file
    except sender.DoesNotExist:
        return
    new_file = instance.file
    if old_file and old_file != new_file and os.path.isfile(old_file.path):
        os.remove(old_file.path)

@receiver(post_delete, sender=EducationalContent)
def delete_file_on_delete(sender, instance, **kwargs):
    file = instance.file
    if file and os.path.isfile(file.path):
        os.remove(file.path)