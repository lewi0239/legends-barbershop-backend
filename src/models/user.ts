import { Schema, model, type InferSchemaType } from "mongoose";

const UserSchema = new Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    provider: {
      type: String,
      enum: ["google", "email", "phone"],
      default: "google",
    },
    role: {
      type: String,
      enum: ["client", "barber", "admin"],
      default: "client",
    },
    firstName: { type: String },
    lastName: { type: String },
    displayName: { type: String },
    profilePic: { type: String },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export type User = InferSchemaType<typeof UserSchema>;
export const UserModel = model<User>("User", UserSchema);
