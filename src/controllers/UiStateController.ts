import LoginState from "../types/LoginState";
import UiState from "../types/UiState";

export interface IUiStateController {
  setLoginState(state: LoginState): void;
}

type UiStateSetter = React.Dispatch<React.SetStateAction<UiState>>;

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

}
