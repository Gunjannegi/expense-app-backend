import { Cashfree, CFEnvironment } from "cashfree-pg";
import Order from "../models/order.js";
import { createOrderService } from "../services/cashfreeService.js";
import User from "../models/user.js";

const cashfree = new Cashfree(
  CFEnvironment.SANDBOX,
  process.env.CF_APP_ID,
  process.env.CF_SECRET
);
export const createOrderController = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user.id;
    const email = req.user.useremail;
    const phone = req.user.userphone;

    const orderId = "order_" + Date.now();
    const paymentSessionId = await createOrderService(
      orderId,
      amount,
      "INR",
      userId,
      email,
      phone
    );

    // Save order in database
    await Order.create({
      orderId: orderId,
      userId,
      status: "PENDING"
    });

    return res.status(200).json({
      success: true,
      orderId,
      paymentSessionId,
    });

  } catch (error) {
    console.error("Controller Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Unable to create order",
    });
  }
};

export const verifyOrderController = async (req, res) => {
  try {
    const { orderId } = req.body;
    const userId = req.user.id;

    const response = await cashfree.PGOrderFetchPayments(orderId);
    const payments = response.data;

    // Payment SUCCESS
    const isPaid = payments.some(
      (p) =>
        p.payment_status === "SUCCESS" ||
        p.payment_status === "COMPLETED"
    );

    if (isPaid) {
      await Order.update(
        { status: "SUCCESS" },
        { where: { orderId } }
      );

      await User.update(
        { isPremium: true },
        { where: { id: userId } }
      );

      return res.json({
        success: true,
        status: "SUCCESS",
        message: "Payment verified!"
      });
    }

    // Payment PENDING
    const isPending = payments.some(
      (p) => p.payment_status === "PENDING"
    );

    if (isPending) {
      await Order.update(
        { status: "PENDING" },
        { where: { orderId } }
      );

      return res.json({
        success: false,
        status: "PENDING",
        message: "Payment is pending. Please wait."
      });
    }

    // User cancelled / failed
    await Order.update(
      { status: "FAILED" },
      { where: { orderId } }
    );

    return res.json({
      success: false,
      status: "FAILED",
      message: "Payment was cancelled or failed"
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

