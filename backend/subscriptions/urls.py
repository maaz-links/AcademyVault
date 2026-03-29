# subscriptions/urls.py
from django.urls import path, include
from . import views, webhooks
from rest_framework.routers import DefaultRouter
from .views import TierViewSet

router = DefaultRouter()
router.register(r"tiers", TierViewSet, basename="tiers")

urlpatterns = [
    path("", include(router.urls)),
    path("subscription-status/", views.subscription_status),
    path('create-checkout-session/<int:tier_id>/', views.create_checkout_session, name='create-checkout-session'),
    path("billing-portal/", views.billing_portal),
    path('webhook/', webhooks.stripe_webhook, name='stripe-webhook'),
]