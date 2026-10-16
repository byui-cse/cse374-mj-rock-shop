"""Request and response models for quotes and mock orders."""

from pydantic import BaseModel, ConfigDict, Field


class OrderQuoteRequest(BaseModel):
    product_id: str = Field(min_length=1, max_length=100)
    quantity: int = Field(default=1, ge=1, le=100)


class CustomerInformation(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: str = Field(min_length=3, max_length=254)
    address: str = Field(min_length=1, max_length=200)
    city: str = Field(min_length=1, max_length=100)
    state: str = Field(min_length=1, max_length=50)
    zip: str = Field(min_length=1, max_length=20)


class OrderCreateRequest(OrderQuoteRequest):
    customer: CustomerInformation
    shipping_carrier: str = Field(min_length=1, max_length=30)
    shipping_service: str = Field(min_length=1, max_length=30)
    card_number: str = Field(min_length=1, max_length=32)
    card_name: str = Field(min_length=1, max_length=120)
    expiry: str = Field(min_length=1, max_length=10)


class ShippingOptionResponse(BaseModel):
    carrier: str
    service: str
    estimated_delivery: str


class OrderQuoteResponse(BaseModel):
    product_id: str
    product_name: str
    quantity: int
    subtotal: float
    total: float
    shipping_options: list[ShippingOptionResponse]


class OrderConfirmation(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    order_id: int
    order_number: str
    status: str
    product_id: str
    product_name: str
    quantity: int
    total: float
    shipping_carrier: str
    shipping_service: str
    expected_delivery: str
    payment_reference: str

