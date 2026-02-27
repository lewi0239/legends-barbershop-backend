import { googleClient } from "../utils/googleClient.js";
import { UserModel } from "../models/user.model.js";
import { signAccess, signRefresh } from "../utils/jwt.js";

export async function handleGoogleCode(code: string) {
  const { tokens } = await googleClient.getToken(code);
  const ticket = await googleClient.verifyIdToken({
    idToken: tokens.id_token!,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const p = ticket.getPayload()!;
  const user = await UserModel.findOneAndUpdate(
    { googleId: p.sub },
    {
      $set: {
        email: p.email?.toLowerCase(),
        firstName: p.given_name,
        lastName: p.family_name,
        profilePic: p.picture,
      },
      $setOnInsert: { googleId: p.sub },
    },
    { new: true, upsert: true }
  );
  const access = signAccess({ uid: user._id, googleId: p.sub });
  const refresh = signRefresh({ uid: user._id, googleId: p.sub });
  return { user, access, refresh };
}
