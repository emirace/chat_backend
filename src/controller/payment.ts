import { Response } from "express";
import { CustomRequest } from "../middleware/user";
import { io } from "../app";

export const updatePayment = async (req: CustomRequest, res: Response) => {
  try {
    const { id, status } = req.body;

    if (!id || !status) {
      res.status(400).json({
        success: false,
        message: "Full id and status are required",
      });
      return;
    }

    io.emit("update-payment", { id, status });

    res.status(200).json("Success");
  } catch (error) {
    console.error("Failed updating status", error);
    res
      .status(200)
      .json({ status: false, message: "Failed updating status", error });
  }
};
