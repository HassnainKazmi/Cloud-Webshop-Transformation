import os
import requests
from postmarker.core import PostmarkClient
from .enums import StockLevel

mailgun_api_key = os.getenv("MAIL_GUN_API_KEY")
url = "https://api.mailgun.net/vN/domainAbcdefg.mailgun.org"
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
        # print(
        #     {
        #         "From": os.getenv("POST_MARK_SENDER"),
        #         "To": recipient,
        #         "TemplateId": template_id,
        #         "TemplateModel": kwargs,
        #     }
        # )
        # postmark.emails.send_with_template(
        #     From=os.getenv("POST_MARK_SENDER"),
        #     To=recipient,
        #     TemplateId=template_id,
        #     TemplateModel=kwargs,
        # )
        requests.post(
            url,
            auth=("api", "email.mail.faizan.me"),
            data={
                "from": "muhammad.ghani@stud.fra-uas.de",
                "to": ["muhammad.ghani@stud.fra-uas.de"],
                "subject": "New Contact Entry",
                "text": "hello world",
            },
        )
        return True
    except Exception as e:
        print(e)
        raise e


def is_it_true(value: str):
    return value.lower() == "true"
