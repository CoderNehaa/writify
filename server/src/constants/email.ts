export const SIGNUP_EMAIL = {
  SUBJECT: "Welcome to writify!",
  BODY: (otp: string, username?: string) => `
Hello ${username || "user"}, 

Welcome to app! Your account is created successfully, kindly use ${otp} as OTP to verify your account!

`,
};
