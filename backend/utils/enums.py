import enum


class StockLevel(enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    OUT_OF_STOCK = "OUT OF STOCK"


class OrderStatus(enum.Enum):
    IN_PROCESS = "IN_PROCESS"  # When order is awaiting approval
    CONFIRMED = "CONFIRMED"  # When order is confirmed
    DELIVERED = "DELIVERED"  # When order is complete
