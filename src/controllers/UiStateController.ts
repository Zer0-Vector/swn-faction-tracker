import GameMode from "../types/GameMode";
import LoginState from "../types/LoginState";
import { Maybe } from "../types/Maybe";
import { TurnInfo } from "../types/TurnInfo";
import { TurnState } from "../types/TurnState";
import UiState from "../types/UiState";

type ValueOrSetterArg<T, V = T> = T | ((prev: T) => V);
export type LoginStateSetter = (state: LoginState) => void;
export type EditModeSetter = (mode: GameMode, forceEndTurn?: true) => void;
export type TurnStateSetter = (state: Exclude<TurnState, "OFF">) => void;
type TurnInfoSetterArg = ValueOrSetterArg<Maybe<TurnInfo>, TurnInfo>;
export type TurnInfoSetter = (info: TurnInfoSetterArg) => void;
export type TurnIndexSetter = ((setterOrValue: ValueOrSetterArg<number>) => void);

export interface IUiStateController {
  setLoginState: LoginStateSetter;
  setEditMode: EditModeSetter;
  setTurnState: TurnStateSetter;
  setTurnInfo: TurnInfoSetter;
  setTurnIndex: TurnIndexSetter;
}

export type UiStateSetter = React.Dispatch<React.SetStateAction<UiState>>;

export class UiStateController implements IUiStateController {

  private readonly setState: UiStateSetter;

  constructor(setState: UiStateSetter) {
    this.setState = setState;
  }

  setTurnIndex(indexOrSetter: ValueOrSetterArg<number>) {
    const nextTurnIndex = (typeof indexOrSetter === "function")
      ? indexOrSetter
      : () => indexOrSetter;

    this.setState(prev => {
      const turnIndex = nextTurnIndex(prev.turnIndex);
      if (turnIndex === prev.turnIndex) {
        return prev;
      }
      return ({
        ...prev,
        turnIndex,
      });
    });
  }

  setTurnInfo(info: TurnInfoSetterArg) {
    const nextTurnInfo = (typeof info === "function")
      ? info
      : () => info;
    this.setState(prev => {
      return ({
        ...prev,
        turnInfo: nextTurnInfo(prev.turnInfo),
      });
    });
  }

  setLoginState(state: LoginState): void {
    this.setState(prev => ({
      ...prev,
      loginState: state,
    }));
  }

  setEditMode(mode: GameMode, forceEndTurn?: true) {
    let needsForce = false;

    this.setState(prev => {
      if (prev.editMode === mode) {
        return prev;
      }

      if (prev.editMode === "TURN" && prev.turnState !== "COMPLETE" && !forceEndTurn) {
        needsForce = true;
        return prev;
      }

      return {
        ...prev,
        editMode: mode,
        turnState: mode === "TURN" ? "IDLE" : "OFF",
        turnIndex: 0,
        turnInfo: undefined,
      };
    });

    if (needsForce) {
      throw new Error("Cannot end incomplete turn without forceEndTurn=true");
    }
  }

  setTurnState: TurnStateSetter = (state) => {
    this.setState(prev => ({
      ...prev,
      turnState: state,
    }));
  };

}
