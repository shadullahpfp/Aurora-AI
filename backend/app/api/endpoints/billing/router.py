from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any
from app.core.database import get_db
from app.services.billing.stripe_service import create_checkout_session, get_billing_portal_url
import stripe
from app.core.config import settings

router = APIRouter()

@router.post("/checkout")
async def create_checkout(
    # req_data: CheckoutRequest,
    # current_user = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Generate a Stripe checkout session for upgrading SaaS tier (Pro/Enterprise).
    Returns checkout URL.
    """
    # Mock lookup
    org_id = "mock-org-123"
    
    url = create_checkout_session(
        org_id=org_id,
        success_url="https://app.aurora-ai.com/dashboard/settings?success=true",
        cancel_url="https://app.aurora-ai.com/dashboard/settings?canceled=true"
    )
    
    return {"url": url}

@router.post("/portal")
async def create_portal(
    # current_user = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Generate a Stripe Customer Portal link so users can manage cards/invoices.
    """
    # Requires storing user's specific stripe_customer_id in Organization table
    customer_id = "cus_mock123"
    url = get_billing_portal_url(customer_id, "https://app.aurora-ai.com/dashboard/settings")
    return {"url": url}

@router.post("/webhook")
async def stripe_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    """
    Listen for asynchronous Stripe events (successful payment, failed sub, etc.)
    Update our Organization `subscription_tier` in Postgres.
    """
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    
    if not settings.STRIPE_WEBHOOK_SECRET:
         return {"status": "mock_success_skip"}

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
        
    if event['type'] == 'checkout.session.completed':
         session = event['data']['object']
         # Lookup DB via session.client_reference_id (org_id)
         # Session successfully paid -> upgrade tier to "pro"
         print(f"Stripe Webhook: Checkout complete for ORG: {session.client_reference_id}")

    return {"status": "success"}
