from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import EducationalContent
from .serializers import EducationalContentSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from django.http import HttpResponse, Http404, FileResponse
from django.conf import settings
import os

@permission_classes([IsAuthenticated])
class EducationalContentViewSet(viewsets.ModelViewSet):
    #queryset = EducationalContent.objects.all()
    # queryset = EducationalContent.objects.none()
    serializer_class = EducationalContentSerializer
    # Required for file uploads
    parser_classes = (MultiPartParser, FormParser)
    http_method_names = ["get"]

    # make sure basename is included in routes
    def get_queryset(self):
        user = self.request.user
        return EducationalContent.objects.all()

def private_file_view(request, filename):
    # Example: Only logged-in users can download
    if not request.user.is_authenticated:
        raise Http404("Not allowed")

    file_path = os.path.join(settings.MEDIA_ROOT, "private", filename)
    if os.path.exists(file_path):
        with open(file_path, 'rb') as f:
            response = HttpResponse(f.read(), content_type="application/octet-stream")
            response['Content-Disposition'] = f'attachment; filename="{filename}"'
            return response
    else:
        raise Http404("File not found")
    
def download_content(request, pk):
    try:
        content = EducationalContent.objects.get(pk=pk)
    except EducationalContent.DoesNotExist:
        raise Http404()

    # if content.is_private and not request.user.is_authenticated:
    if not request.user.is_authenticated:
        raise Http404()

    return FileResponse(content.file.open())
    
def download_private_file(request, path):

    if not request.user.is_authenticated:
        raise Http404("Login required")

    file_path = os.path.join(settings.MEDIA_ROOT, "private", path)

    if not os.path.exists(file_path):
        raise Http404("File not found")

    return FileResponse(open(file_path, "rb"))