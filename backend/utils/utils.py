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
