import { OAuth2Client } from "google-auth-library";
import { UserService } from "./UserService";
import { AuthService } from "./AuthService";
import { config } from "@/config";
import { OAuthUserData, OAuthResponse, AuthenticationError } from "@/types";
import mongoose from "mongoose";

export class OAuthService {
  private userService: UserService;
  private authService: AuthService;
  private googleClient: OAuth2Client;

  constructor() {
    this.userService = new UserService();
    this.authService = new AuthService();
    this.googleClient = new OAuth2Client(config.oauth.google.clientId);
  }

  async googleSignIn(idToken: string): Promise<OAuthResponse> {
    try {
      const userInfo = await this.verifyGoogleToken(idToken);

      return await this.handleOAuthUser({
        email: userInfo.email,
        name: userInfo.name,
        provider: "google",
        providerId: userInfo.sub,
        avatar: userInfo.picture,
      });
    } catch (error: any) {
      console.error("Google OAuth Error:", error.message);
      throw new AuthenticationError(
        "Google authentication failed: " + error.message
      );
    }
  }

  private async verifyGoogleToken(idToken: string): Promise<any> {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: idToken,
        audience: config.oauth.google.clientId,
      });

      const payload = ticket.getPayload();

      if (!payload || !payload.email || !payload.sub) {
        throw new Error("Invalid Google token payload");
      }

      console.log("Google user verified:", {
        email: payload.email,
        name: payload.name,
        verified: payload.email_verified,
      });

      return {
        sub: payload.sub,
        email: payload.email,
        name: payload.name || payload.email.split("@")[0],
        given_name: payload.given_name,
        family_name: payload.family_name,
        picture: payload.picture,
        email_verified: payload.email_verified,
      };
    } catch (error: any) {
      console.error("Google token verification failed:", error.message);
      throw new Error("Failed to verify Google token: " + error.message);
    }
  }

  private async handleOAuthUser(
    oauthData: OAuthUserData
  ): Promise<OAuthResponse> {
    let user = await this.userService.getUserByEmail(oauthData.email);
    let isNewUser = false;

    if (user) {
      console.log("Existing user found, updating OAuth provider");
      user = await this.updateOAuthProvider(user, oauthData);
    } else {
      console.log("Creating new OAuth user");
      user = await this.createOAuthUser(oauthData);
      isNewUser = true;
    }

    if (!user) {
      throw new AuthenticationError("Failed to create or update user");
    }

    const token = this.authService.generateToken(
      (user._id as mongoose.Types.ObjectId).toString()
    );

    const { password, ...userWithoutPassword } = user.toObject();

    return {
      user: userWithoutPassword,
      token,
      isNewUser,
    };
  }

  private async updateOAuthProvider(user: any, oauthData: OAuthUserData) {
    const updateData: any = {
      lastActivity: new Date(),
      [`profile.oauthProviders.${oauthData.provider}`]: {
        providerId: oauthData.providerId,
        connectedAt: new Date(),
      },
    };

    if (oauthData.avatar && !user.profile?.avatar) {
      updateData["profile.avatar"] = oauthData.avatar;
    }

    return await this.userService.updateUser(
      (user._id as mongoose.Types.ObjectId).toString(),
      updateData
    );
  }

  private async createOAuthUser(oauthData: OAuthUserData) {
    return await this.userService.createOAuthUser({
      email: oauthData.email,
      name: oauthData.name,
      provider: oauthData.provider,
      providerId: oauthData.providerId,
      avatar: oauthData.avatar,
    });
  }
}
