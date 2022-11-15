const LoginStates = [
  "LOGGED_OUT", // before login, or after logout
  "LOGGING_IN", // login dialog showing (maybe error message)
  "LOGGING_OUT", // logout confirmation showing
  "LOGOUT_WAITING", // after logout confirm, before server response
  "LOGGED_IN", // after login dialog success
  "LOGIN_WAITING", // after login button click, before login success/failure
  "REGISTERING", // showing registration dialog (maybe error message)
  "REGISTER_WAITING", // after register button click, before register success/failure
  "REGISTERED", // showing instructional dialog, after register success
  "NEEDS_VERIFICATION", // showing instructional dialog with resend link
  "VERIFICATION_ERROR", // error sending verification, showing error dialog
  "RESETTING_PASSWORD", // showing reset password dialog
] as const;

type LoginState = typeof LoginStates[number];

export default LoginState;
