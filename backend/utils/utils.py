import os
from flask import render_template
from flask_mail import Message
from postmarker.core import PostmarkClient
from app import mail
from .enums import StockLevel

postmark = PostmarkClient(server_token=os.getenv("POST_MARKER_SERVER_API_TOKEN"))


def calculate_stock_level(quantity):
    if quantity >= 30:
        return StockLevel.HIGH
    elif quantity < 30 and quantity >= 20:
        return StockLevel.MEDIUM
    elif quantity < 20 and quantity > 0:
        return StockLevel.LOW
    if quantity == 0:
        return StockLevel.OUT_OF_STOCK


def send_mail(recipient: str, template_id: int, **kwargs):
    try:
        print(
            {
                "From": os.getenv("POST_MARK_SENDER"),
                "To": recipient,
                "TemplateId": template_id,
                "TemplateModel": kwargs,
            }
        )
        postmark.emails.send_with_template(
            From=os.getenv("POST_MARK_SENDER"),
            To=recipient,
            TemplateId=template_id,
            TemplateModel=kwargs,
        )
        return True
    except Exception as e:
        print(e)
        raise e


def send_mail_gmail(subject: str, recipients: list[str], template_name: str, **kwargs):
    try:
        html_body = render_template(template_name, **kwargs)
        email = Message(
            subject=subject, sender=os.getenv("MAIL_USERNAME"), recipients=recipients
        )
        email.html = html_body
        mail.send(email)
    except Exception as e:
        print(e)
        raise e


def is_it_true(value: str):
    return value.lower() == "true"
