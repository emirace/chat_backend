import dotenv from "dotenv";
import User from "../model/user";
import jwt from "jsonwebtoken";

dotenv.config();

const secretKey = process.env.JWT_SECRET || "";

export async function generateAccessToken(userId: string): Promise<string> {
  if (!secretKey) {
    throw new Error("Secret key not found");
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("user not found");
  }
  user.tokenVersion += 1;
  user.save();
  const token = jwt.sign(
    { userId, id: userId, email: user.email, version: user.tokenVersion },
    secretKey,
    {
      expiresIn: "30d",
    }
  ); // Adjust the expiration time as needed
  return token;
}

// Helper function to generate a random 5-digit OTP
function generateOtp(): string {
  return String(Math.floor(10000 + Math.random() * 90000)); // Ensures 5 digits
}
