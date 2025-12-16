import type { Request, Response, NextFunction } from "express";
import SupportStaffModel from "@models/supportStaff.js";
import { json } from "stream/consumers";

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

export const getAllSupportStaff = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sortBy = "fistName", order = "asc" } = req.query;

    const sortOptions: any = {
      [sortBy as string]: order === "desc" ? -1 : 1,
    };

    const supportStaffs = await SupportStaffModel.find().sort(sortOptions);
    return res.status(200).json(supportStaffs);
  } catch (error) {
    next(error);
  }
};

export const updateSupportStaff = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params;
    const { firstName, lastName, phoneNumber, email, role } = req.body;

    if (!firstName || !lastName || !phoneNumber || !email || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const supportStaff = await SupportStaffModel.findById(id);
    if (!supportStaff) {
      return res.status(404).json({ message: "Support Staff not found" });
    }

    const duplicate = await SupportStaffModel.findOne({
      _id: { $ne: id },
      $or: [{ email }, { phoneNumber }],
    });

    if (duplicate) {
      return res
        .status(400)
        .json({ message: "Another Support Staff already has these values" });
    }

    supportStaff.firstName = firstName;
    supportStaff.lastName = lastName;
    supportStaff.phoneNumber = phoneNumber;
    supportStaff.email = email;

    await supportStaff.save();
  } catch (error) {
    next(error);
  }
};
