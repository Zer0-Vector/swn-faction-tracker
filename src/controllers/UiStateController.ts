import { PurchasedAsset } from "../types/PurchasedAsset";
import { UiState } from "../types/UiState";

export interface IUiStateController {
  selectFaction(name: string | null): void;
  selectAsset(pa: PurchasedAsset | null) : void;
  deselectFaction(): void;
}

type UiStateSetter = React.Dispatch<React.SetStateAction<UiState>>;

export class UiStateController implements IUiStateController {

  private setState: UiStateSetter;

  constructor(setState: UiStateSetter) {
    this.setState = setState;
  }

  selectFaction(name: string | null): void {
    this.setState((prev: UiState) => {
      if (prev.selectedFaction === name) {
        return prev;
      }

      return {
        ...prev,
        hasFactionSelected: name !== null,
        selectedAssetKey: null,
        selectedFaction: name,
      };
    });
  }

  selectAsset(pa: PurchasedAsset | null): void {
    this.setState(prev => ({
      ...prev,
      selectedAssetKey: pa === null ? null : PurchasedAsset.getKey(prev.selectedFaction as string, pa as PurchasedAsset)
    }));
  }

  deselectFaction(): void {
    this.setState(prev => ({
      ...prev,
      selectedAssetKey: null,
      hasFactionSelected: false,
    }));
  }

}
