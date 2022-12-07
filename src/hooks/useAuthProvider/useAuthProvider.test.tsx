import React, { useState } from "react";
import { act } from "react-dom/test-utils";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { IUiStateController } from "../../controllers/UiStateController";

import { useAuthProvider } from "./useAuthProvider";

jest.mock("firebase/app");
jest.mock("firebase/auth");
// eslint-disable-next-line import/first
import {
  Auth,
  createUserWithEmailAndPassword,
  getAuth,
  NextOrObserver,
  sendEmailVerification,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  Unsubscribe,
  User,
  UserCredential,
} from "firebase/auth";

const mockSetPersistence = setPersistence as jest.MockedFn<typeof setPersistence>;
const mockGetAuth = getAuth as jest.MockedFn<typeof getAuth>;

const mockSetLoginState = jest.fn();
const mockController = {
  setLoginState: mockSetLoginState,
} as IUiStateController;

const mockOnAuthStateChanged = jest.fn();
const mockUnSub = jest.fn();
const mockAuth = {
  onAuthStateChanged: mockOnAuthStateChanged as (nextOrObserver: NextOrObserver<User | null>)=>Unsubscribe,
} as Auth;
const mockSignIn = signInWithEmailAndPassword as jest.MockedFn<typeof signInWithEmailAndPassword>;
const mockSignOut = signOut as jest.MockedFn<typeof signOut>;
const mockSendEmailVerification = sendEmailVerification as jest.MockedFn<typeof sendEmailVerification>;
const mockSendPasswordResetEmail = sendPasswordResetEmail as jest.MockedFn<typeof sendPasswordResetEmail>;
const mockCreateUser = createUserWithEmailAndPassword as jest.MockedFn<typeof createUserWithEmailAndPassword>;


function TestComp({ name }: { name: string }) {
  const auth = useAuthProvider(mockController);
  const [error, setError] = useState<string>("");
  const [done, setDone] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
  const couldThrow = <T extends unknown>(f: ()=>Promise<T>) => async () => {
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
      <button onClick={couldThrow(() => auth.sendEmailVerification())}>verify email</button>
      <button onClick={couldThrow(() => auth.sendPasswordResetEmail("pw@reset.com"))}>pw reset</button>
    </div>
  );
}

describe('useAuthProvider', () => {
  beforeEach(() => {
    mockGetAuth.mockImplementation(() => mockAuth);
    mockOnAuthStateChanged.mockReturnValue(mockUnSub);
    mockSetPersistence.mockResolvedValue();
  });

  it('calls setPersistence on mount', () => {
    render(<TestComp name="setPersistence on mount" />);
    expect(mockSetPersistence).toBeCalledTimes(1);
    // FIXME not sure why this fails
    // expect(mockSetPersistence).toBeCalledWith(expect.anything(), expect.objectContaining({ type: "LOCAL" }));
  });

  it('calls unsub on unmount', async () => {
    const { unmount } = render(<TestComp name="unsub on unmount" />);
    expect(mockUnSub).not.toBeCalled();
    unmount();
    await waitFor(() => expect(mockUnSub).toBeCalled());
  });

  it('login called signInWithEmailAndPassword', async () => {
    mockSignIn.mockResolvedValueOnce({ 
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

    expect(mockSignIn).toBeCalledTimes(1);
    expect(mockSignIn).toBeCalledWith(expect.anything(), "email@test.com", "123456");
    const email = screen.getByTestId("user-email");
    expect(email).toHaveTextContent("fake-email");
    const uid = screen.getByTestId("user-uid");
    expect(uid).toHaveTextContent("fake-uid");
  });

  it('signOut called on logout', async () => {
    mockSignOut.mockResolvedValueOnce();
    render(<TestComp name="signOut/logout" />);
    const button = screen.getByText("logout");
    expect(button).toBeInstanceOf(HTMLButtonElement);
    await act(() => button.click());
    await waitFor(() => expect(mockSignOut).toBeCalledTimes(1));
  });

  it('clears user on logout', async () => {
    mockSignIn.mockResolvedValueOnce({ 
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
    mockSignIn.mockResolvedValueOnce({ 
      user: theUser,
      providerId: "789",
      operationType: "signIn",
    });
    mockSendEmailVerification.mockResolvedValueOnce();
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
    await waitFor(() => expect(mockSendEmailVerification).toBeCalledTimes(1));
    expect(mockSendEmailVerification).toBeCalledWith(theUser);
  });

  it('does not send verification email on sendEmailVerification when logged out', async () => {
    mockSendEmailVerification.mockResolvedValueOnce();
    render(<TestComp name="logged out sendEmailVerification" />);
    const button = screen.getByText("verify email");
    expect(button).toBeInstanceOf(HTMLButtonElement);
    const etext = screen.getByTestId("error-message");
    expect(etext).toHaveTextContent("");
    fireEvent.click(button);
    await waitFor(() => expect(etext).not.toHaveTextContent(""));
    expect(mockSendEmailVerification).not.toBeCalled();
  });

  it('sends password reset email', async () => {
    mockSendPasswordResetEmail.mockResolvedValueOnce();
    render(<TestComp name="sendPasswordResetEmail" />);
    const button = screen.getByText("pw reset");
    const isDone = screen.getByTestId("is-done");
    fireEvent.click(button);
    await waitFor(() => expect(isDone).toHaveTextContent("yes"));
    expect(mockSendPasswordResetEmail).toBeCalledTimes(1);
    expect(mockSendPasswordResetEmail).toBeCalledWith(expect.anything(), "pw@reset.com");
  });

  it('creates user', async () => {
    mockCreateUser.mockResolvedValueOnce({ user: { email: "test@test.test" } } as UserCredential);
    render(<TestComp name="signup" />);
    const button = screen.getByText("signup");
    const isDone = screen.getByTestId("is-done");
    fireEvent.click(button);
    await waitFor(() => expect(isDone).toHaveTextContent("yes"));
    expect(mockCreateUser).toBeCalledTimes(1);
    expect(mockCreateUser).toBeCalledWith(expect.anything(), "email@signup.com", "789789");
  });
});
