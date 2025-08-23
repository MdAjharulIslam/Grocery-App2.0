import Address from "../models/address.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
// Add or update user address: POST /api/address/add
export const addAddress = async (req, res) => {
  try {
    const { userId, address } = req.body;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid userId format.",
      });
    }

    // Check if user already has an address
    const existingAddress = await Address.findOne({ userId });

    if (existingAddress) {
      // Update existing address
      await Address.findOneAndUpdate({ userId }, address);
      return res.json({
        success: true,
        message: "Address updated successfully",
      });
    }

    // If not found, create a new address
    await Address.create({ userId, ...address });

    res.json({
      success: true,
      message: "Address added successfully",
    });
  } catch (error) {
    console.error("Error adding/updating address:", error);
    res.status(500).json({
      success: false,
      message: "Error adding/updating address",
      error: error.message,
    });
  }
};

//get address : /api/address/get

export const getAddress = async (req, res) => {
  try {
    let token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const addresses = await Address.find({ userId });

    res.json({
      success: true,
      addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error getting address",
      error: error.message,
    });
  }
};
