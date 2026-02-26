import { Schema, model, type Document } from "mongoose";

export interface Service extends Document {
  serviceType: string;
  hasBeenPaid: false;
}

const ServiceSchema = new Schema<Service>(
  {
    serviceType: { type: String, required: true },
    hasBeenPaid: { type: Boolean, required: true },
  },
  { timestamps: true }
);

const ServiceModel = model<Service>("Service", ServiceSchema);

export default ServiceModel;
