import GameMode from "../types/GameMode";
import LoginState from "../types/LoginState";
import { TurnState } from "../types/TurnState";
import UiState from "../types/UiState";

export type LoginStateSetter = (state: LoginState) => void;
export type EditModeSetter = (mode: GameMode, forceEndTurn?: true) => void;
export type TurnStateSetter = (state: Exclude<TurnState, "OFF">) => void;

export interface IUiStateController {
  setLoginState: LoginStateSetter;
  setEditMode: EditModeSetter;
  setTurnState: TurnStateSetter;
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

  setEditMode(mode: GameMode, forceEndTurn?: true) {
    let needsForce = false;
    new Promise<void>((resolve, reject) => {
      this.setState(prev => {
        if (prev.editMode === mode) {
          try {
            return prev;
          } finally {
            resolve();
          }
        }
  
        if (prev.editMode === "TURN" && prev.turnState !== "COMPLETE" && !forceEndTurn) {
          try {
            return prev;
          } finally {
            reject();
          }
        }
  
        try {
          return {
            ...prev,
            editMode: mode,
            turnState: mode === "TURN" ? "IDLE" : "OFF",
          };
        } finally {
          resolve();
        }
      });
    }).catch(() => needsForce = true);
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
