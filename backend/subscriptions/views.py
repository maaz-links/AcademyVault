# subscriptions/views.py
import stripe
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from .models import Tier, UserSubscription
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from rest_framework.viewsets import ReadOnlyModelViewSet
from .serializers import TierSerializer

stripe.api_key = settings.STRIPE_SECRET_KEY  # set in settings.py

class TierViewSet(ReadOnlyModelViewSet):
    queryset = Tier.objects.all().order_by("level")
    serializer_class = TierSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def subscription_status(request):
    sub = request.user.get_active_subscription()

    if sub:
        return Response({
            "is_subscribed": True,
            "tier_id": sub.tier.id,
            "tier_name": sub.tier.name
        })

    return Response({
        "is_subscribed": False
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_checkout_session(request, tier_id):
    tier = get_object_or_404(Tier, id=tier_id)
    domain_url = settings.FRONTEND_URL  # your React frontend URL

    try:
        checkout_session = stripe.checkout.Session.create(
            success_url=f"{domain_url}/success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{domain_url}/cancel",
            payment_method_types=["card"],
            mode="subscription",
            line_items=[{
                'price': tier.stripe_price_id,
                'quantity': 1,
            }],
            customer_email=request.user.email,  # optional: pre-fill email
            metadata={
                "user_id": request.user.id,
                "tier_id": tier.id
            }
        )
        return JsonResponse({'id': checkout_session.id,"url": checkout_session.url})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def billing_portal(request):
    domain_url = settings.FRONTEND_URL  # your React frontend URL
    subscription = UserSubscription.objects.filter(user=request.user, active=True).first()

    if not subscription:
        return Response({"error": "No active subscription"}, status=400)

    portal = stripe.billing_portal.Session.create(
        customer=subscription.stripe_customer_id,
        return_url=f"{domain_url}/tiers"
    )

    return Response({
        "url": portal.url
    })