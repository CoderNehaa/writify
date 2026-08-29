interface ISignUpPayload {
  fullName: string;
  username: string;
  email: string;
  password: string;
  providerType?: string;
}

interface ISignInPayload {
  email: string;
  password: string;
}

interface IVerifyPayload {
  email: string;
  otp: string;
}
