import type { Request, Response, NextFunction } from "express";
import { barbers, getNextId } from "@models/barber.js";
import type { Barber } from "@models/barber.js";

//CRUD Operations

// Create a barber
export const createBarber = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstName, lastName, phoneNumber, email } = req.body;
    if (!firstName || !lastName || !phoneNumber || !email) {
      res.status(400).json({ message: "Missing required barber field" });
      return;
    }
    const newBarber: Barber = {
      id: getNextId(),
      firstName,
      lastName,
      phoneNumber,
      email,
    };
    barbers.push(newBarber);
    res.status(201).json(newBarber);
  } catch (error) {
    next(error);
  }
};

//Read babrers (lookup all barber objects)
export const getAllBarbers = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(barbers);
  } catch (error) {
    next(error);
  }
};

//Update a barber
export const updateBarber = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { firstName, lastName, phoneNumber, email } = req.body;

    if (
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !email ||
      typeof firstName !== "string" ||
      typeof lastName !== "string" ||
      typeof phoneNumber !== "string" ||
      typeof email !== "string"
    ) {
      return res.status(400).json({
        message:
          "All fields must be non-empty strings: firstName, lastName, phoneNumber, email.",
      });
    }

    const barberIndex = barbers.findIndex((i: Barber) => i.id === id);
    if (barberIndex === -1) {
      return res.status(400).json({ message: "Barber not found" });
    }

    barbers[barberIndex] = {
      ...barbers[barberIndex],
      firstName,
      lastName,
      phoneNumber,
      email,
    };

    return res.json(barbers[barberIndex]);
  } catch (error) {
    next(error);
  }
};

//Delete Barber
export const deleteBarber = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const barberIndex = barbers.findIndex((i: Barber) => i.id === id);
    if (barberIndex === -1) {
      return res.status(400).json({ message: "Barber not found" });
    }

    const deletedBarber = barbers.splice(barberIndex, 1)[0];
    return res.status(200).json(deletedBarber);
  } catch (error) {
    next(error);
  }
};

//sort barbers A-z
export const sortBarber = (

req:Request,
res: Response,
next: NextFunction
) => {
    try {
    const id = parseInt(req.params.id, 10);
    const barberIndex = barbers.sort((a, b) => a.id - b.id));
        return res.status(200).json({message: "No barber to sort"})
    } catch (error) {
    next(error);
    }
}
