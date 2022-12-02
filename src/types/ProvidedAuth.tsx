import { User } from "firebase/auth";

import { Maybe } from "./Maybe";

export interface ProvidedAuth {
  /**
   * The current logged in User.
   */
  user: Maybe<User>;

  /**
   * User Login
   * @param email The user's email
   * @param password The user's password
   * @returns The logged in User
   * @throws FirebaseError if error logging in, including credential mismatch
   */
  login(email: string, password: string): Promise<User>;

  /**
   * Logs out current User.
   */
  logout(): Promise<void>;

  /**
   * User Sign Up
   * @param email The user's email
   * @param password The user's password
   * @returns The logged in User
   * @throws FirebaseError
   */
  signup(email: string, password: string): Promise<User>;

  /**
   * Send verification email for current logged in user.
   */
  sendEmailVerification(): Promise<void>;

  /**
   * Send password reset instructions to the given email.
   * @param email The user's email
   */
  sendPasswordResetEmail(email: string): Promise<void>;

  /**
   * Confirm password reset with given code and new password.
   * @param code The confirmation code given to the User.
   * @param password The User's new password.
   */
  confirmPasswordReset(code: string, password: string): Promise<void>;
}
