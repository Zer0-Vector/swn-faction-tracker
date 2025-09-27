import GameMode from "./GameMode";
import LoginState from "./LoginState";
import { Maybe } from "./Maybe";
import { TurnInfo } from "./TurnInfo";
import { TurnState } from "./TurnState";

export default interface UiState {
  loginState: LoginState;
  editMode: GameMode;
  turnState: TurnState;
  turnInfo: Maybe<TurnInfo>;
  turnIndex: number;
}
