import os
from flask_mail import Message
from app import mail
from .enums import StockLevel


def calculate_stock_level(quantity):
    if quantity > 30:
        return StockLevel.HIGH
    elif quantity > 20:
        return StockLevel.MEDIUM
    elif quantity > 5:
        return StockLevel.LOW
    else:
        return StockLevel.OUT_OF_STOCK


def send_mail(subject: str, message: str, recipients: list[str]):
    try:
        email = Message(
            subject=subject, sender=os.getenv("MAIL_USERNAME"), recipients=recipients
        )
        email.body = message
        mail.send(email)
        return True
    except Exception as e:
        print(e)
        raise e
