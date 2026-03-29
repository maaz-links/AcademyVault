# subscriptions/webhooks.py
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.conf import settings
from .models import UserSubscription, Tier
import stripe
from datetime import datetime, timezone
from django.utils import timezone as dj_timezone

stripe.api_key = settings.STRIPE_SECRET_KEY

@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET

    # Verify webhook signature
    try:
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
    except Exception as e:
        return HttpResponse(status=400)

    # --------------------------
    # 1️⃣ New subscription from Checkout
    # --------------------------
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']

        user_id = session["metadata"].get("user_id")
        tier_id = session["metadata"].get("tier_id")
        subscription_id = session.get("subscription")
        customer_id = session.get("customer")

        if not all([user_id, tier_id, subscription_id, customer_id]):
            return HttpResponse(status=400)

        user = User.objects.get(id=user_id)
        tier = Tier.objects.get(id=tier_id)

        UserSubscription.objects.update_or_create(
            user=user,
            defaults={
                "tier": tier,
                "stripe_customer_id": customer_id,
                "stripe_subscription_id": subscription_id,
                "active": False, #dont active here, active at below event
            }
        )

    # --------------------------
    # 2️⃣ Invoice succeeded (renewals)
    # --------------------------
    elif event["type"] == "invoice.payment_succeeded":
        invoice = event["data"]["object"]

        subscription_id = invoice["parent"]["subscription_details"]["subscription"]
        if not subscription_id:
            return HttpResponse(status=400)

        # Stripe timestamps are in seconds
        period_end_ts = invoice["lines"]["data"][0]["period"]["end"]
        period_end = datetime.fromtimestamp(period_end_ts, tz=timezone.utc)
        active_status = period_end > dj_timezone.now()

        subscription = UserSubscription.objects.filter(
            stripe_subscription_id=subscription_id
        ).first()

        if subscription:
            subscription.current_period_end = period_end
            subscription.active = active_status
            subscription.save()

    # --------------------------
    # 3️⃣ Subscription updated (plan change, trial end, etc.)
    # --------------------------
    elif event["type"] == "customer.subscription.updated":
        sub = event["data"]["object"]
        subscription_id = sub.get("id")
        if not subscription_id:
            return HttpResponse(status=400)

        subscription = UserSubscription.objects.filter(
            stripe_subscription_id=subscription_id
        ).first()

        if subscription:
            # Update Stripe status
            # stripe_status = sub.get("status")  # active, past_due, trialing, canceled, incomplete
            # subscription.status = stripe_status
            # subscription.active = True

            # Update tier based on Stripe price ID
            if sub.get("items") and sub["items"]["data"]:
                price_id = sub["items"]["data"][0]["price"]["id"]
                try:
                    tier = Tier.objects.get(stripe_price_id=price_id)
                    subscription.tier = tier
                except Tier.DoesNotExist:
                    pass  # Unknown price, ignore or log

            # Update current_period_end
            if sub.get("current_period_end"):
                period_end = datetime.fromtimestamp(period_end_ts, tz=timezone.utc)
                subscription.current_period_end = period_end
                subscription.active = period_end > dj_timezone.now()

            subscription.save()

    # --------------------------
    # 4️⃣ Subscription canceled
    # --------------------------
    elif event["type"] == "customer.subscription.deleted":
        sub = event["data"]["object"]
        subscription_id = sub.get("id")
        if not subscription_id:
            return HttpResponse(status=400)

        subscription = UserSubscription.objects.filter(
            stripe_subscription_id=subscription_id
        ).first()

        if subscription:
            subscription.active = False
            subscription.save()

    # --------------------------
    # Optional: handle failed invoices
    # --------------------------
    elif event["type"] == "invoice.payment_failed":
        invoice = event["data"]["object"]
        subscription_id = invoice.get("subscription")
        if subscription_id:
            subscription = UserSubscription.objects.filter(
                stripe_subscription_id=subscription_id
            ).first()
            if subscription:
                subscription.active = False
                subscription.save()

    return HttpResponse(status=200)