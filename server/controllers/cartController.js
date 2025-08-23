import user from "../models/user.js";

// update user cartData : /api/cart/update
export const updateCart = async (req, res) => {
  try {
    const { userId, cartItems } = req.body;

    // Check if the userId and cartItems exist
    if (!userId || !cartItems) {
      return res.json({
        success: false,
        message: "Missing userId or cartItems.",
      });
    }

    // Update the user's cartItems in the database
    const updatedUser = await user.findByIdAndUpdate(
      userId,
      { cartItems },
      { new: true } // This ensures that the updated user document is returned
    );

    if (!updatedUser) {
      return res.json({
        success: false,
        message: "User not found.",
      });
    }

    // Return the updated user info (optional, but can be useful for frontend)
    res.json({
      success: true,
      message: "Cart updated successfully",
      user: updatedUser, // You can return the updated user, including the updated cartItems
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
