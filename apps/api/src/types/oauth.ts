export interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  verified_email: boolean;
}

export interface AppleUserInfo {
  sub: string;
  email: string;
  email_verified: boolean;
  name?: {
    firstName: string;
    lastName: string;
  };
}

export interface OAuthUserData {
  email: string;
  name: string;
  provider: "google" | "apple";
  providerId: string;
  avatar?: string;
}

export interface OAuthRequest {
  provider: "google" | "apple";
  token: string;
  userInfo?: any;
}

export interface OAuthResponse {
  user: any;
  token: string;
  isNewUser: boolean;
}
