
import { Cashfree, CFEnvironment } from "cashfree-pg";

const cashfree = new Cashfree(
  CFEnvironment.SANDBOX,
  process.env.CF_APP_ID,
  process.env.CF_SECRET
);

export const createOrderService = async (
  orderId,
  orderAmount,
  orderCurrency = "INR",
  customerID,
  customerEmail,
  customerPhone
) => {
  try {
    const expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    const formattedExpiryDate = expiryDate.toISOString();

    const request = {
      order_id: String(orderId),
      order_amount: orderAmount,
      order_currency: orderCurrency,
      customer_details: {
        customer_id: String(customerID),
        customer_email: customerEmail,
        customer_phone: customerPhone
      },
      order_meta: {
        return_url: `http://localhost:5173/payment-status/${orderId}`,
        payment_methods: "cc,dc,upi",
      },
      order_expiry_time: formattedExpiryDate,
    };

    const response = await cashfree.PGCreateOrder(request);

    return response.data.payment_session_id;

  } catch (error) {
     console.log("Cashfree FULL ERROR ======>");
  console.dir(error, { depth: null });

    console.error("Cashfree Error:", error?.response?.data || error.message);
    throw new Error("Failed to create Cashfree order");
  }
};
