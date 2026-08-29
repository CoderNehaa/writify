export const ACCESS_TOKEN_NAME = "access_token";
export const REFRESH_TOKEN_NAME = "refresh_token";
export const ACCESS_TOKEN_EXPIRY_TIME = "1h";
export const REFRESH_TOKEN_EXPIRY_TIME = "7d";

export const passwordRegex = new RegExp(
  [
    "(?=.*[a-z])", // at least one lowercase letter
    "(?=.*[A-Z])", // at least one uppercase letter
    "(?=.*\\d)", // at least one number
    "(?=.*[!@#$%^&*()_+\\-=[\\]{};:\"'|,.<>/?])", // at least one special character
  ].join("")
);

export const USERNAME_LENGTH = {
  MIN: 3,
  MAX: 8,
};

export const PASSWORD_LENGTH = {
  MIN: 6,
  MAX: 12,
};

export const AUTH_RESPONSE_MESSAGES = {
  NEW_SIGNUP: (email: string) =>
    `Account created successfully! Check OTP on email ${email} and verify your account`,
  EXISTING_SIGNUP: (email: string) =>
    `Account already exists with email ${email}! Verify your account`,
};
