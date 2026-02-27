import { Schema, model, type Document } from "mongoose";
import { Barber } from "../models/barber.js";
import { Client } from "../models/client.js";
import { Service } from "../models/service.js";

export enum Status {
  pending = "pending",
  confirmed = "confirmed",
  cancelled = "cancelled",
}

export interface Appointment extends Document {
  client: Client;
  barber: Barber;
  service: Service;
  status: Status;
}

const AppointmentSchema = new Schema<Appointment>(
  {
    client: { type: Schema.Types.ObjectId, ref: "Client", required: true },
    barber: { type: Schema.Types.ObjectId, ref: "Barber", required: true },
    service: { type: Schema.Types.ObjectId, ref: "Service", required: true },
  },
  {
    timestamps: true,
  }
);

const AppointmentModel = model<"Appointment">("Appointment", AppointmentSchema);
