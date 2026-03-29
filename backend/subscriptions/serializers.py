# tiers/serializers.py

from rest_framework import serializers
from .models import Tier

class TierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tier
        fields = [
            "id",
            "name",
            "price",
            "description",
            "is_default",
            "level",
        ]