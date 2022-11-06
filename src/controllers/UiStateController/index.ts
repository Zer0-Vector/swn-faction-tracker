import { UiState } from "../../types/UiState";

export interface IUiStateController {
  selectFaction(name: string | null): void;
  selectAsset(name: string | null) : void;
}

type UiStateSetter = React.Dispatch<React.SetStateAction<UiState>>

export class UiStateController implements IUiStateController {

  private setState: UiStateSetter;

  constructor(setState: UiStateSetter) {
    this.setState = setState;
  }

  selectFaction(name: string | null): void {
    this.setState((prev: UiState) => ({
      ...prev,
      selectedFaction: name,
    }));
  }

  selectAsset(name: string | null): void {
    this.setState((prev: UiState) => ({
      ...prev,
      selectedAsset: name,
    }));
  }

}