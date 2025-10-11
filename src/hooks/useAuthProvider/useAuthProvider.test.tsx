import React, { useState } from "react";
import { act } from "react-dom/test-utils";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { IUiStateController } from "../../controllers/UiStateController";
import LoginState from "../../types/LoginState";

import { useAuthProvider } from "./useAuthProvider";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import type { Auth, User, UserCredential } from "firebase/auth";

vi.mock("firebase/app");

const mocks = vi.hoisted(() => ({
  onAuthStateChanged: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  sendEmailVerification: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  getAuth: vi.fn(),
  setPersistence: vi.fn(),
}));

vi.mock("firebase/auth", async () => {
  const originalModule = await vi.importActual("firebase/auth");
  return {
    ...originalModule,
    ...mocks,
  }
})


const mockSetLoginState = vi.fn();
const mockController = {
  setLoginState: mockSetLoginState as (s: LoginState) => void,
} as IUiStateController;

const mockUnsubscribe = vi.fn();

function TestComp({ name }: { readonly name: string }) {
  const auth = useAuthProvider(mockController);
  const [error, setError] = useState<string>("");
  const [done, setDone] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
  const couldThrow = <T extends unknown>(f: () => Promise<T>) => async () => {
    try {
      await f();
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else if (typeof e === "string") {
        setError(e);
      }
    } finally {
      setDone(true);
    }
  };

  console.info("testing:", name);

  return (
    <div>
      <h1>Test:{name}</h1>
      <div>
        <p data-testid="user-email">{auth.currentUser?.email}</p>
        <p data-testid="user-uid">{auth.currentUser?.uid}</p>
        <p data-testid="error-message">{error}</p>
        <p data-testid="is-done">{done ? "yes" : "no"}</p>
      </div>
      <button onClick={couldThrow(() => auth.login("email@test.com", "123456"))}>login</button>
      <button onClick={couldThrow(() => auth.logout())}>logout</button>
      <button onClick={couldThrow(() => auth.signup("email@signup.com", "789789"))}>signup</button>
      <button onClick={couldThrow(() => { if (!auth.currentUser) { throw new Error("NULL USER!"); } return auth.sendEmailVerification(auth.currentUser); })}>verify email</button>
      <button onClick={couldThrow(() => auth.sendPasswordResetEmail("pw@reset.com"))}>pw reset</button>
    </div>
  );
}

describe('useAuthProvider', () => {
  beforeEach(() => {
    vi.mocked(getAuth).mockImplementation(() => ({
      onAuthStateChanged: mocks.onAuthStateChanged
    } as unknown as Auth));
    vi.mocked(onAuthStateChanged).mockImplementation(() => mockUnsubscribe);
    vi.mocked(setPersistence).mockResolvedValue();
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.resetModules();
  });

  it('calls setPersistence on mount', () => {
    render(<TestComp name="setPersistence on mount" />);
    expect(setPersistence).toBeCalledTimes(1);
    expect(setPersistence).toBeCalledWith(expect.anything(), expect.objectContaining({ type: browserLocalPersistence.type }));
  });

  it('calls unsubscribe on unmount', async () => {
    mockUnsubscribe.mockClear(); // XXX: not sure why this is needed...
    const { unmount } = render(<TestComp name="unsubscribe on unmount" />);
    expect(mockUnsubscribe).not.toBeCalled();
    unmount();
    await waitFor(() => expect(mockUnsubscribe).toBeCalled());
  });

  it('login called signInWithEmailAndPassword', async () => {
    vi.mocked(signInWithEmailAndPassword).mockResolvedValueOnce({
      user: {
        email: "fake-email",
        uid: "fake-uid",
      } as User,
      providerId: "789",
      operationType: "signIn",
    });
    render(<TestComp name="signIn/login" />);
    const button = screen.getByText("login");
    expect(button).toBeInstanceOf(HTMLButtonElement);
    fireEvent.click(button);

    const isDone = screen.getByTestId("is-done");
    await waitFor(() => expect(isDone).toHaveTextContent("yes"));

    expect(signInWithEmailAndPassword).toBeCalledTimes(1);
    expect(signInWithEmailAndPassword).toBeCalledWith(expect.anything(), "email@test.com", "123456");
    const email = screen.getByTestId("user-email");
    expect(email).toHaveTextContent("fake-email");
    const uid = screen.getByTestId("user-uid");
    expect(uid).toHaveTextContent("fake-uid");
  });

  it('signOut called on logout', async () => {
    vi.mocked(signOut).mockResolvedValueOnce();
    render(<TestComp name="signOut/logout" />);
    const button = screen.getByText("logout");
    expect(button).toBeInstanceOf(HTMLButtonElement);
    await act(() => button.click());
    await waitFor(() => expect(signOut).toBeCalledTimes(1));
  });

  it('clears user on logout', async () => {
    vi.mocked(signInWithEmailAndPassword).mockResolvedValueOnce({
      user: {
        email: "fake-email",
        uid: "fake-uid",
      } as User,
      providerId: "789",
      operationType: "signIn",
    });
    render(<TestComp name="clears user on logout" />);
    const loginButton = screen.getByText("login");
    expect(loginButton).toBeInstanceOf(HTMLButtonElement);
    const logoutButton = screen.getByText("logout");
    expect(logoutButton).toBeInstanceOf(HTMLButtonElement);

    const email = screen.getByTestId("user-email");
    const uid = screen.getByTestId("user-uid");
    expect(email).not.toHaveTextContent("fake-email");
    expect(uid).not.toHaveTextContent("fake-uid");

    fireEvent.click(loginButton);
    await waitFor(() => expect(email).toHaveTextContent("fake-email"));
    expect(uid).toHaveTextContent("fake-uid");

    fireEvent.click(logoutButton);
    await waitFor(() => expect(email).not.toHaveTextContent("fake-email"));
    expect(uid).not.toHaveTextContent("fake-uid");
  });

  it('sends verification email on sendEmailVerification', async () => {
    const theUser = {
      email: "fake-email",
      uid: "fake-uid",
    } as User;
    vi.mocked(signInWithEmailAndPassword).mockResolvedValueOnce({
      user: theUser,
      providerId: "789",
      operationType: "signIn",
    });
    vi.mocked(sendEmailVerification).mockResolvedValueOnce();
    render(<TestComp name="sendEmailVerification" />);
    const loginButton = screen.getByText("login");
    expect(loginButton).toBeInstanceOf(HTMLButtonElement);
    await act(() => loginButton.click());
    const email = screen.getByTestId("user-email");
    const uid = screen.getByTestId("user-uid");
    await waitFor(() => expect(email).toHaveTextContent("fake-email"));
    expect(uid).toHaveTextContent("fake-uid");

    const button = screen.getByText("verify email");
    expect(button).toBeInstanceOf(HTMLButtonElement);
    await act(() => button.click());
    await waitFor(() => expect(sendEmailVerification).toBeCalledTimes(1));
    expect(sendEmailVerification).toBeCalledWith(theUser);
  });

  it('does not send verification email on sendEmailVerification when logged out', async () => {
    vi.mocked(sendEmailVerification).mockResolvedValueOnce();
    render(<TestComp name="logged out sendEmailVerification" />);
    const button = screen.getByText("verify email");
    expect(button).toBeInstanceOf(HTMLButtonElement);
    const errorText = screen.getByTestId("error-message");
    expect(errorText).toHaveTextContent("");
    fireEvent.click(button);
    await waitFor(() => expect(errorText).not.toHaveTextContent(""));
    expect(sendEmailVerification).not.toBeCalled();
  });

  it('sends password reset email', async () => {
    vi.mocked(sendPasswordResetEmail).mockResolvedValueOnce();
    render(<TestComp name="sendPasswordResetEmail" />);
    const button = screen.getByText("pw reset");
    const isDone = screen.getByTestId("is-done");
    fireEvent.click(button);
    await waitFor(() => expect(isDone).toHaveTextContent("yes"));
    expect(sendPasswordResetEmail).toBeCalledTimes(1);
    expect(sendPasswordResetEmail).toBeCalledWith(expect.anything(), "pw@reset.com");
  });

  it('creates user', async () => {
    vi.mocked(createUserWithEmailAndPassword).mockResolvedValueOnce({ user: { email: "test@test.test" } } as UserCredential);
    render(<TestComp name="signup" />);
    const button = screen.getByText("signup");
    const isDone = screen.getByTestId("is-done");
    fireEvent.click(button);
    await waitFor(() => expect(isDone).toHaveTextContent("yes"));
    expect(createUserWithEmailAndPassword).toBeCalledTimes(1);
    expect(createUserWithEmailAndPassword).toBeCalledWith(expect.anything(), "email@signup.com", "789789");
  });
});
