# subscriptions/webhooks.py
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
import stripe
from django.conf import settings
from .models import UserSubscription
from django.contrib.auth.models import User
from .models import Tier

stripe.api_key = settings.STRIPE_SECRET_KEY

@csrf_exempt
def stripe_webhook(request):

    payload = request.body
    sig_header = request.META['HTTP_STRIPE_SIGNATURE']
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except Exception:
        return HttpResponse(status=400)

    # SUBSCRIPTION CREATED FROM CHECKOUT
    if event['type'] == 'checkout.session.completed':

        session = event['data']['object']

        user_id = session["metadata"]["user_id"]
        tier_id = session["metadata"]["tier_id"]

        subscription_id = session["subscription"]
        customer_id = session["customer"]

        user = User.objects.get(id=user_id)
        tier = Tier.objects.get(id=tier_id)

        UserSubscription.objects.update_or_create(
            user=user,
            defaults={
                "tier": tier,
                "stripe_customer_id": customer_id,
                "stripe_subscription_id": subscription_id,
                # "active": True
            }
        )

    elif event["type"] == "invoice.payment_succeeded":

        invoice = event["data"]["object"]

        subscription_id = invoice["parent"]["subscription_details"]["subscription"]

        period_end = invoice["lines"]["data"][0]["period"]["end"]

        from datetime import datetime
        renewal_date = datetime.fromtimestamp(period_end)

        subscription = UserSubscription.objects.get(
            stripe_subscription_id=subscription_id
        )

        if subscription:
            subscription.active = True
            subscription.current_period_end = renewal_date
            subscription.save()

    # SUBSCRIPTION UPDATED (UPGRADE / DOWNGRADE)
    elif event["type"] == "customer.subscription.updated":

        sub = event["data"]["object"]

        UserSubscription.objects.filter(
            stripe_subscription_id=sub["id"]
        ).update(
            active=(sub["status"] == "active")
        )

    # SUBSCRIPTION CANCELED
    elif event["type"] == "customer.subscription.deleted":

        sub = event["data"]["object"]

        UserSubscription.objects.filter(
            stripe_subscription_id=sub["id"]
        ).update(active=False)

    return HttpResponse(status=200)