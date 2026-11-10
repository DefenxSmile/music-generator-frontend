export type OpenAuthOptions = {
  next?: string;
  intent?: "create" | "enter";
};

/** Java `AccessTokenResponse` from oauth/token, login, refresh. */
export type AccessTokenResponse = {
  accessToken: string;
  expiresIn?: number;
};
