import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import User from "../model/user";
import dotenv from "dotenv";

dotenv.config();

export interface CustomRequest extends Request {
  userId?: string;
  userRole?: string;
}

// Middleware for authorization
export const authorize = (requiredRoles?: ("Admin" | "User" | "Guest")[]) => {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      // Extract the access token from the request headers or query params
      const accessToken = String(
        req.headers.authorization?.split(" ")[1] || req.query.accessToken
      );

      if (!accessToken) {
        res.status(401).json({ message: "Access token is missing" });
        return;
      }
      const secretKey = process.env.JWT_SECRET;

      if (!secretKey) {
        res.status(500).json({ message: "JWT secret key is not configured" });
        return;
      }

      // Verify the access token
      const decoded: any = jwt.verify(accessToken, secretKey);
      console.log(decoded);

      // Check if the token version matches the user's tokenVersion
      const user = await User.findById(decoded.id);
      console.log(user);
      if (!user) {
        res.status(401).json({ message: "Invalid user token" });
        return;
      }

      // Check if a required role is specified
      if (
        requiredRoles &&
        requiredRoles.length > 0 &&
        !requiredRoles.includes(user.role)
      ) {
        res.status(403).json({ message: "Access forbidden" });
        return;
      }

      // Attach user data to the request object for use in the route handler
      req.userId = user._id.toString();
      req.userRole = user.role;

      // Continue to the next middleware or route handler
      next();
    } catch (error) {
      console.log("error", error);
      if (error instanceof TokenExpiredError) {
        res.status(403).json({ message: "Token expired" });
        return;
      } else {
        res.status(403).json({ message: "Invalid token" });
        return;
      }
    }
  };
};
