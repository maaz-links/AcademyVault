from django.contrib import admin
from .models import Tier, UserSubscription

# admin.site.register(Tier)
admin.site.register(UserSubscription)

@admin.register(Tier)
class TierAdmin(admin.ModelAdmin):
    list_display = ["name", "level", "is_default"]
    
    # Make is_default read-only in admin
    readonly_fields = ["is_default"]

    def has_delete_permission(self, request, obj=None):
        # Hide delete button if editing the default tier
        if obj and obj.is_default:
            return False
        return super().has_delete_permission(request, obj)
