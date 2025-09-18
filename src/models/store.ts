import { Schema, model, type InferSchemaType } from "mongoose";

const ShopSchema = new Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String },
    email: { type: String },
    address: { type: String },
    timezone: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export type Shop = InferSchemaType<typeof ShopSchema>;
export const ShopModel = model<Shop>("Shop", ShopSchema);

export interface ShopView {
  id: string;
  name: string;
  phoneNumber?: string;
  email?: string;
  barbers?: {
    _id: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    email?: string;
  }[];
}
