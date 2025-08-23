import Order from "../models/order.js";
import Product from "../models/product.js";

// place order COD : /api/order/cod

export const placeOrderCOD = async (req, res) => {
  try {
    const { userId, items, address } = req.body;

    if (!address || items.length === 0) {
      return res.json({
        success: false,
        message: "Address and items are required",
      });
    }

    // Calculate total amount
    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.json({ success: false, message: "Product not found" });
      }
      amount += product.offerPrice * item.quantity;
    }

    // Add tax (2%) and round
    const tax = Math.floor(amount * 0.02);
    amount += tax;

    // Map items correctly to match schema
    const orderItems = items.map((item) => ({
      product: item.product,
      quantity: item.quantity,
    }));

    // Create the order
    await Order.create({
      userId,
      items: orderItems, 
      address,
      amount,
      paymentType: "COD",
      isPaid: true,
    });

    return res.json({
      success: true,
      message: "Order placed successfully",
    });

  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// get order by userId : /api/order/user
 
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.userId; 

    const orders = await Order.find({ userId })
    .populate('items.product') 
    .populate('address')
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// for all orders (for admin) : /api/order/seller
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
    .populate("items.product address")
    .sort({ createdAt: -1 });

    return res.json({
      success: true,
      message: "Orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
