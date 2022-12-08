import GameMode from "./GameMode";
import LoginState from "./LoginState";

export default interface UiState {
  loginState: LoginState;
  editMode: GameMode;
}
