import { Schema, model, type Document } from "mongoose";

// 1. TypeScript interface
export interface Barber extends Document {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}

// 2. Mongoose schema
const BarberSchema = new Schema<Barber>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

// 3. Mongoose model
const BarberModel = model<Barber>("Barber", BarberSchema);

export default BarberModel;
