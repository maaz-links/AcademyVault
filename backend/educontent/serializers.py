from rest_framework import serializers
from .models import EducationalContent
from subscriptions.serializers import TierSerializer
from django.urls import reverse

# class EducationalContentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = EducationalContent
#         fields = "__all__"

class EducationalContentSerializer(serializers.ModelSerializer):
    download_url = serializers.SerializerMethodField()
    is_accessible = serializers.SerializerMethodField()
    file = serializers.FileField(write_only=True)
    tier = TierSerializer(read_only=True)


    class Meta:
        model = EducationalContent
        fields = ["id", "title", "description","file", "download_url", "is_accessible", "tier"]

    def get_is_accessible(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return request.user.has_access_to_tier(obj.tier)
        return False

    def get_download_url(self, obj):
        # Check access before returning URL
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            if request.user.has_access_to_tier(obj.tier):
                return request.build_absolute_uri(
                    reverse("download-file", args=[obj.id])
                )
        return None