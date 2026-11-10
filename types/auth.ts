export type OpenAuthOptions = {
  next?: string;
  intent?: "create" | "enter";
};

/** Java `AccessTokenResponse` from oauth/token and refresh. */
export type AccessTokenResponse = {
  accessToken: string;
  expiresIn?: number;
  /** Stand returns refresh in the body; send it back as RefreshRequest. */
  refreshToken?: string;
};

/** Java `RefreshRequest` for `/auth/refresh` and `/auth/logout`. */
export type RefreshRequest = {
  refreshToken: string;
};
