import { isGameMode } from "../types/GameMode";
import LoginState from "../types/LoginState";
import UiState from "../types/UiState";

export type LoginStateSetter = (state: LoginState) => void;

export interface IUiStateController {
  setLoginState: LoginStateSetter;
  setEditMode: (value: string) => void;
}

export type UiStateSetter = React.Dispatch<React.SetStateAction<UiState>>;

export class UiStateController implements IUiStateController {

  private setState: UiStateSetter;

  constructor(setState: UiStateSetter) {
    this.setState = setState;
  }

  setLoginState(state: LoginState): void {
    this.setState(prev => ({
      ...prev,
      loginState: state,
    }));
  }

  setEditMode(mode: string) {
    if (!isGameMode(mode)) {
      throw new Error(`Unknown GameMode: ${mode}`);
    }
    this.setState(prev => ({
      ...prev,
      editMode: mode,
    }));
  }

}
