const LoginStates = [
  "LOGGED_OUT", // before login, or after logout
  "LOGGING_IN", // login dialog showing
  "LOGGING_OUT", // logout confirmation showing
  "LOGOUT_WAITING", // after logout confirm, before server response
  "LOGGED_IN", // after login dialog success
  "LOGIN_ERROR", // after login failure, error dialog showing
  "LOGIN_WAITING", // after login button click, before login success/failure
  "REGISTERING", // showing registration dialog
  "REGISTER_WAITING", // after register button click, before register success/failure
  "REGISTER_ERROR", // after register failure
  "REGISTERED", // showing instructional dialog, after register success
] as const;

type LoginState = typeof LoginStates[number];

export default LoginState;
