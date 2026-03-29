from django.urls import path, include
from rest_framework import routers
from .views import EducationalContentViewSet, private_file_view, download_private_file, download_content

router = routers.DefaultRouter()
router.register(r"content", EducationalContentViewSet, basename='educationalcontent')

urlpatterns = [
    path("", include(router.urls)),
    # path("private-files/<path:filename>/", private_file_view, name="private-file"),
    # path("download/<path:path>/", download_private_file),
    path("download/<int:pk>/", download_content, name="download-file")
]