import { Schema, model, type InferSchemaType } from "mongoose";

const UserSchema = new Schema(
  {
    username: {
      type: String,
      minLength: 3,
      maxLength: 64,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
      minLength: 6,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    firstName: { type: String },
    lastName: { type: String },
    profilePic: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export type User = InferSchemaType<typeof UserSchema>;
export const UserModel = model<User>("User", UserSchema);
