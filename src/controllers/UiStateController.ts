import LoginState from "../types/LoginState";
import Nullable from "../types/Nullable";
import PurchasedAsset, { PurchasedAssetUtils } from "../types/PurchasedAsset";
import UiState from "../types/UiState";

export interface IUiStateController {
  setLoginState(state: LoginState): void;
  selectLocaion(locationName: Nullable<string>): void;
  selectFaction(name: Nullable<string>): void;
  selectAsset(pa: Nullable<PurchasedAsset>) : void;
  clearSelections(): void;
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

  selectFaction(name: Nullable<string>): void {
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

  selectAsset(pa: Nullable<PurchasedAsset>): void {
    this.setState(prev => ({
      ...prev,
      selectedAssetKey: pa === null ? null : PurchasedAssetUtils.getKey(prev.selectedFaction as string, pa as PurchasedAsset)
    }));
  }

  selectLocaion(locationName: Nullable<string>): void {
    this.setState(prev => ({
      ...prev,
      selectedLocation: locationName,
    }));
  }

  clearSelections(): void {
    this.setState(prev => ({
      ...prev,
      selectedFaction: null,
      selectedAssetKey: null,
      selectedLocation: null,
      hasFactionSelected: false,
    }));
  }

}
