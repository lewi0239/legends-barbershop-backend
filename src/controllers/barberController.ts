import type { Request, Response, NextFunction } from "express";
import BarberModel from "../models/barber.js";
// ─────────────────────────────────────────────
// Create a Barber
export const createBarber = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstName, lastName, phoneNumber, email } = req.body;

    if (!firstName || !lastName || !phoneNumber || !email) {
      return res
        .status(400)
        .json({ message: "Missing required barber fields" });
    }

    // Check for duplicates
    const existing = await BarberModel.findOne({
      $or: [{ firstName }, { lastName }, { phoneNumber }, { email }],
    });

    if (existing) {
      return res.status(400).json({ message: "Barber already exists!" });
    }

    const newBarber = await BarberModel.create({
      firstName,
      lastName,
      phoneNumber,
      email,
    });

    console.log("💈 Barber created:", newBarber);
    return res.status(201).json(newBarber);
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// Get All Barbers (with optional sorting)
export const getAllBarbers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sortBy = "firstName", order = "asc" } = req.query;

    const sortOptions: any = {
      [sortBy as string]: order === "desc" ? -1 : 1,
    };

    const barbers = await BarberModel.find().sort(sortOptions);
    return res.status(200).json(barbers);
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// Update Barber by ID
export const updateBarber = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const { firstName, lastName, phoneNumber, email } = req.body;

    if (!firstName || !lastName || !phoneNumber || !email) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check if barber exists
    const barber = await BarberModel.findById(id);
    if (!barber) {
      return res.status(404).json({ message: "Barber not found" });
    }

    // Check for uniqueness on email or phone
    const duplicate = await BarberModel.findOne({
      _id: { $ne: id },
      $or: [{ email }, { phoneNumber }],
    });

    if (duplicate) {
      return res.status(400).json({
        message: "Another barber already has this email or phone number.",
      });
    }

    barber.firstName = firstName;
    barber.lastName = lastName;
    barber.phoneNumber = phoneNumber;
    barber.email = email;

    await barber.save();

    console.log(`💈 Barber ${id} updated`, barber);
    return res.status(200).json(barber);
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// Delete Barber by ID
export const deleteBarber = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    const barber = await BarberModel.findByIdAndDelete(id);

    if (!barber) {
      return res.status(404).json({ message: "Barber not found" });
    }

    console.log(`💈 Deleted barber:`, barber);
    return res.status(200).json(barber);
  } catch (error) {
    next(error);
  }
};
