from django.core.mail import EmailMessage
import dramatiq
from typing import List


@dramatiq.actor()
def send_email(subject: str, body: str, to: List[str]):
    email = EmailMessage(
        subject=subject,
        body=body,
        from_email="Onroad <support@maalik.dev>",
        reply_to=["support@maalik.dev"],
        to=to,
    )
    email.content_subtype = "html"
    email.send()
