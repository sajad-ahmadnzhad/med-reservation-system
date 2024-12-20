export interface SignupUser {
  accessToken: string;
  refreshToken: string;
  message: string;
}

export interface SigninUser extends SignupUser {}

export interface RefreshToken
  extends Omit<SignupUser, "accessToken" | "refreshToken"> {
  newAccessToken: string;
}

export interface GenerateTokens extends Omit<SignupUser, "message"> {}

export interface GoogleOAuthUser {
  name: string;
  username: string;
  email: string;
  avatarURL: string;
}
