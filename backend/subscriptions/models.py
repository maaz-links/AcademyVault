# subscriptions/models.py
from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

class Tier(models.Model):
    name = models.CharField(max_length=50, unique=True)  # free, pro, premium
    stripe_price_id = models.CharField(max_length=255, null=True, help_text="Stripe Price ID")
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True)
    is_default = models.BooleanField(default=False) # to determine free tier
    level = models.PositiveSmallIntegerField(default=0) 
    
    def __str__(self):
        return self.name
    
    def clean(self):
        # Only one default tier allowed
        if self.is_default:
            qs = Tier.objects.filter(is_default=True)
            if self.pk:
                qs = qs.exclude(pk=self.pk)
            if qs.exists():
                raise ValidationError("Only one tier can have is_default=True.")

        # Non-default tiers must have stripe_price_id
        if not self.is_default and not self.stripe_price_id:
            raise ValidationError("Tiers mush have a Stripe Price ID.")

    def delete(self, *args, **kwargs):
        # Prevent deleting the default tier
        if self.is_default:
            raise ValidationError("Cannot delete the default tier.")
        super().delete(*args, **kwargs)

    def save(self, *args, **kwargs):
        # Run clean() automatically before saving
        self.full_clean()
        super().save(*args, **kwargs)


class UserSubscription(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    tier = models.ForeignKey(Tier, on_delete=models.SET_NULL, null=True)
    stripe_subscription_id = models.CharField(max_length=255, blank=True, null=True)
    stripe_customer_id = models.CharField(max_length=255, null=True, blank=True)
    active = models.BooleanField(default=False)
    current_period_end = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.tier.name if self.tier else 'No Tier'}"