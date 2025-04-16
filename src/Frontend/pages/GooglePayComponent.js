import React from "react";
import GooglePayButton from "@google-pay/button-react";

export default function GooglePayComponent({ onPaymentSuccess, price }) {
  return (
    <GooglePayButton
      environment="TEST"
      paymentRequest={{
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [
          {
            type: "CARD",
            parameters: {
              allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
              allowedCardNetworks: ["MASTERCARD", "VISA"],
            },
            tokenizationSpecification: {
              type: "PAYMENT_GATEWAY",
              parameters: {
                gateway: "example",
                gatewayMerchantId: "exampleGatewayMerchantId",
              },
            },
          },
        ],
        merchantInfo: {
          merchantId: "12345678901234567890",
          merchantName: "Elite Matrimony subscription",
        },
        transactionInfo: {
          totalPriceStatus: "FINAL",
          totalPriceLabel: "Total",
          totalPrice: price, 
          currencyCode: "INR",
          countryCode: "IN",
        },
      }}
      onLoadPaymentData={(paymentRequest) => {
        console.log("Payment successful", paymentRequest);
        onPaymentSuccess();
      }}
    />
  );
}
