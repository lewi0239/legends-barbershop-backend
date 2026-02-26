import { Schema, model, type Document } from "mongoose";

export interface Barber extends Document {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}

const BarberSchema = new Schema<Barber>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

const BarberModel = model<Barber>("Barber", BarberSchema);

export default BarberModel;
