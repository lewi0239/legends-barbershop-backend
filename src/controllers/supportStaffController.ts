import type { Request, Response, NextFunction } from "express";
import SupportStaffModel from "@models/supportStaff.js";

//Create a SupportStaff

export const createSupportStaff = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //What contains inside the body for the request
    const { firstName, lastName, phoneNumber, email, role } = req.body;

    //Define exceptions

    //Missing fields test
    if (!firstName || !lastName || !phoneNumber || !email || !role) {
      return res
        .status(400)
        .json({ message: "Missing required support staff fields" });
    }
    //Already existing test
    const existing = await SupportStaffModel.findOne({
      $or: [{ firstName }, { lastName }, { phoneNumber }, { email }, { role }],
    });

    if (existing) {
      return res.status(400).json({ message: "Support staff already exists!" });
    }

    //We now can create the model
    const newSupportStaff = await SupportStaffModel.create({
      firstName,
      lastName,
      phoneNumber,
      email,
      role,
    });

    console.log("Support Staff created:", newSupportStaff);
  } catch (error) {
    next(error);
  }
};
