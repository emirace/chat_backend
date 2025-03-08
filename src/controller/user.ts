import { Response } from "express";
import { CustomRequest } from "../middleware/user";
import User from "../model/user";
import { generateAccessToken } from "../utils/user";

export const loginGuest = async (req: CustomRequest, res: Response) => {
  try {
    const { email, fullName } = req.body;

    // Ensure both fullName and email are provided
    if (!fullName || !email) {
      res.status(400).json({
        success: false,
        message: "Full name and email are required",
      });
      return;
    }

    const existUser = await User.findOne({ email });

    if (existUser && existUser.role !== "Guest") {
      res.status(400).json({
        success: false,
        message: "User with this email already exists, login",
      });
      return;
    }

    // Update or create guest user
    const user: any = await User.findOneAndUpdate(
      { email, role: "Guest" },
      {
        $set: {
          fullName,
          email,
          role: "Guest",
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true,
      }
    );

    // Generate JWT token
    const token = await generateAccessToken(user._id);

    // Return token and user
    res.status(200).json({ status: true, guestUser: { ...user._doc, token } });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ status: false, message: "Error logging in", error });
  }
};
