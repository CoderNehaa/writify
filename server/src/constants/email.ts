export const SIGNUP_EMAIL = {
  SUBJECT: "Welcome to writify!",
  BODY: (otp: string, username?: string) => `
Hello ${username || "user"},

Welcome to app! Your account is created successfully, kindly use ${otp} as OTP to verify your account!

`,
};

export const CONTACT_EMAIL = {
  SUBJECT: (name: string) => `New contact form message from ${name}`,
  BODY: (name: string, email: string, message: string) => `
New message from the Writify contact form:

Name: ${name}
Email: ${email}

${message}
`,
};

export const FORGOT_PASSWORD_EMAIL = {
  SUBJECT: "Your new Writify password",
  BODY: (newPassword: string, username?: string) => `
Hello ${username || "user"},

Your password has been reset. Your new password is: ${newPassword}

Please log in and change it from Settings as soon as possible.
`,
};
