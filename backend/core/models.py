# users/models.py (or signals.py)

from django.contrib.auth.models import User
from subscriptions.models import UserSubscription, Tier

def get_active_subscription(self):
    return UserSubscription.objects.filter(
        user=self,
        active=True
    ).select_related("tier").first()


def is_subscribed(self):
    return self.get_active_subscription() is not None

def has_access_to_tier(self, required_tier):
    active_sub = self.get_active_subscription()
    user_level = active_sub.tier.level if active_sub and active_sub.tier else 0
    # Also handle the default Free tier if user isn't subscribed but content needs level 0
    if not active_sub:
        default_tier = Tier.objects.filter(is_default=True).first()
        if default_tier:
            user_level = default_tier.level
            
    return user_level >= required_tier.level

# attach methods
User.add_to_class("get_active_subscription", get_active_subscription)
User.add_to_class("is_subscribed", property(is_subscribed))
User.add_to_class("has_access_to_tier", has_access_to_tier)