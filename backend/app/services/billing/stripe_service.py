import stripe
from app.core.config import settings

stripe.api_key = settings.STRIPE_SECRET_KEY

# Mocks for when Stripe API Keys are missing in dev environment
def create_checkout_session(org_id: str, success_url: str, cancel_url: str, price_id: str = "price_1xxxxxx") -> str:
    if not settings.STRIPE_SECRET_KEY:
        # Return a mock checkout URL for local testing
        return "https://checkout.stripe.development/mock-checkout"
        
    session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=[{
            'price': price_id,
            'quantity': 1,
        }],
        mode='subscription',
        success_url=success_url,
        cancel_url=cancel_url,
        client_reference_id=org_id,
        metadata={
            "org_id": org_id
        }
    )
    return session.url

def get_billing_portal_url(customer_id: str, return_url: str) -> str:
    if not settings.STRIPE_SECRET_KEY or not customer_id:
        return "https://billing.stripe.development/mock-portal"
        
    session = stripe.billing_portal.Session.create(
        customer=customer_id,
        return_url=return_url
    )
    return session.url
