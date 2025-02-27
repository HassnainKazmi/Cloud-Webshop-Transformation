import os
from postmarker.core import PostmarkClient
from app import mail
from .enums import StockLevel

postmark = PostmarkClient(server_token=os.getenv("POST_MARKER_SERVER_API_TOKEN"))


def calculate_stock_level(quantity):
    if quantity > 30:
        return StockLevel.HIGH
    elif quantity > 20:
        return StockLevel.MEDIUM
    elif quantity < 5:
        return StockLevel.LOW
    if quantity == 0:
        return StockLevel.OUT_OF_STOCK


def send_mail(subject: str, message: str, recipient: str, template_id: int, **kwargs):
    try:
        print(kwargs)
        postmark.emails.send_with_template(
            From=os.getenv("POST_MARK_SENDER"),
            To=recipient,
            TemplateId=template_id,
            # TemplateModel={
            #     "name":"John Doe",
            #     "date":"John Doe",
            #     "description":"John Doe",
            #     "amount":"John Doe",
            #     "total":"John Doe",
            #     "product_name":"John Doe"
            # }
            TemplateModel=kwargs,
        )
        return True
    except Exception as e:
        print(e)
        raise e


def is_it_true(value: str):
    return value.lower() == "true"
