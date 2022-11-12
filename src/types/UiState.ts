import LoginState from "./LoginState";
import Nullable from "./Nullable";

export default interface UiState {
  selectedFaction: Nullable<string>;
  selectedAssetKey: Nullable<string>;
  selectedLocation: Nullable<string>;
  loginState: LoginState;
}
