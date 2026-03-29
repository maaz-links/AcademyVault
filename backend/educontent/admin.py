from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html
from .models import EducationalContent

@admin.register(EducationalContent)
class EducationalContentAdmin(admin.ModelAdmin):
    # Columns shown in list view
    list_display = ("title", "description", "download_link")
    #readonly_fields = ("download_link",)  # make it appear in the form as read-only
    #fields = ("title", "description", "file", "download_link")  # order in form

    def download_link(self, obj):
        if obj.file:
            # reverse your download view
            url = reverse("download-file", args=[obj.id])
            # make clickable
            return format_html('<a href="{}" target="_blank">Download</a>', url)
        return "-"
    
    download_link.short_description = "Download URL"