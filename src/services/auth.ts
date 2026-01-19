import type { DecodedIdToken } from "firebase-admin/auth";
import { UserModel, type User } from "../models/user.js";
import { revokeUserTokens } from "./firebase.js";

export interface UserResponse {
  id: string;
  firebaseUid: string;
  email: string;
  emailVerified: boolean;
  provider: string;
  role: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  profilePic?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

function getProviderFromToken(decodedToken: DecodedIdToken): string {
  const signInProvider = decodedToken.firebase?.sign_in_provider;
  if (signInProvider === "google.com") return "google";
  if (signInProvider === "password") return "email";
  if (signInProvider === "phone") return "phone";
  return "google";
}

function formatUserResponse(user: InstanceType<typeof UserModel>): UserResponse {
  return {
    id: user._id.toString(),
    firebaseUid: user.firebaseUid,
    email: user.email,
    emailVerified: user.emailVerified ?? false,
    provider: user.provider ?? "google",
    role: user.role ?? "client",
    firstName: user.firstName ?? undefined,
    lastName: user.lastName ?? undefined,
    displayName: user.displayName ?? undefined,
    profilePic: user.profilePic ?? undefined,
    isActive: user.isActive ?? true,
    createdAt: user.createdAt as Date,
    updatedAt: user.updatedAt as Date,
  };
}

export async function findOrCreateUser(
  decodedToken: DecodedIdToken
): Promise<UserResponse> {
  const { uid, email, email_verified, name, picture } = decodedToken;

  if (!email) {
    throw new Error("Email is required");
  }

  let user = await UserModel.findOne({ firebaseUid: uid });

  if (user) {
    // Update user info if changed
    const updates: Partial<User> = {};

    if (email_verified !== undefined && user.emailVerified !== email_verified) {
      updates.emailVerified = email_verified;
    }
    if (name && user.displayName !== name) {
      updates.displayName = name;
    }
    if (picture && user.profilePic !== picture) {
      updates.profilePic = picture;
    }

    if (Object.keys(updates).length > 0) {
      user = await UserModel.findByIdAndUpdate(user._id, updates, { new: true });
    }
  } else {
    // Create new user
    const nameParts = name?.split(" ") || [];
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    user = await UserModel.create({
      firebaseUid: uid,
      email: email.toLowerCase(),
      emailVerified: email_verified || false,
      provider: getProviderFromToken(decodedToken),
      role: "client",
      firstName,
      lastName,
      displayName: name,
      profilePic: picture,
      isActive: true,
    });
  }

  return formatUserResponse(user!);
}

export async function getUserByFirebaseUid(
  uid: string
): Promise<UserResponse | null> {
  const user = await UserModel.findOne({ firebaseUid: uid, isActive: true });
  return user ? formatUserResponse(user) : null;
}

export async function updateUserProfile(
  uid: string,
  updates: {
    firstName?: string;
    lastName?: string;
    displayName?: string;
    profilePic?: string;
  }
): Promise<UserResponse | null> {
  const user = await UserModel.findOneAndUpdate(
    { firebaseUid: uid, isActive: true },
    { $set: updates },
    { new: true }
  );
  return user ? formatUserResponse(user) : null;
}

export async function deactivateUser(uid: string): Promise<boolean> {
  const result = await UserModel.findOneAndUpdate(
    { firebaseUid: uid },
    { isActive: false }
  );
  return result !== null;
}

export async function logoutUser(uid: string): Promise<void> {
  await revokeUserTokens(uid);
}
