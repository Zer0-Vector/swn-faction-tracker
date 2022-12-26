import GameMode from "./GameMode";
import LoginState from "./LoginState";
import { TurnState } from "./TurnState";

export default interface UiState {
  loginState: LoginState;
  editMode: GameMode;
  turnState: TurnState;
}
