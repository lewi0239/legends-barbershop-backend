import { Schema, model, type Document } from "mongoose";

export interface SupportStaff extends Document {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  role: Role;
}

export class Role {
  #sinNumber: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  cv: string;

  constructor(
    sinNumber: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    cv: string
  ) {
    this.#sinNumber = sinNumber;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phoneNumber = phoneNumber;
    this.cv = cv;
  }

  toJSON() {
    return `Role: ${this.firstName} ${this.lastName}, Phone: ${this.phoneNumber}, CV: ${this.cv}`;
  }
}

const SupportStaffSchema = new Schema<SupportStaff>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const SupportStaffModel = model<SupportStaff>(
  "SupportStaff",
  SupportStaffSchema
);

export default SupportStaffModel;
