import React, { useEffect, useMemo } from 'react';
import { getAuth, User } from "firebase/auth";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import ThemeProvider from '@mui/material/styles/ThemeProvider';

import { GameContext } from './contexts/GameContext';
import { UiStateContext } from './contexts/UiStateContext';
import { GameController, IGameController } from './controllers/GameController';
import { IUiStateController, UiStateController } from './controllers/UiStateController';
import { useLocalStorage } from './hooks/useLocalStorage';
import LocationsPanel from './pages/LocationsPanel';
import PrimaryPanel from './pages/PrimaryPanel';
import { THEME } from './style/Theme';
import PageContainer from './templates/PageContainer';
import RuntimeGameState from './types/RuntimeGameState';
import StoredGameState from './types/StoredGameState';
import UiState from './types/UiState';

function App() {
  const [storedState, setStoredState] = useLocalStorage<StoredGameState>("Faction-GameState", 
    {
      factions: [],
      factionOrder: [],
      assets: [],
      locations: [],
      locationsOrder: [],
      mode: "EDIT", // TODO default mode should be VIEW
    }
  );

  const gameState: RuntimeGameState = useMemo(() => new RuntimeGameState(storedState), [storedState]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const gameController: IGameController = useMemo(() => new GameController(gameState, setStoredState), [gameState]);

  const [uiState, setUiState] = useLocalStorage<UiState>("Faction-UiState", 
    {
      selectedFaction: null,
      selectedAssetKey: null,
      selectedLocation: null,
      loginState: "LOGGED_OUT",
    }
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const uiController: IUiStateController = useMemo(() => new UiStateController(setUiState), []);

  useEffect(() => {
    console.debug("Registering onAuthStateChanged");
    getAuth().onAuthStateChanged((user: User | null) => {
      console.debug("Checking login status: ", user);
      if (user) {
        uiController.setLoginState("LOGGED_IN");
      }
    });
  }, [uiController]);

  useEffect(() => {
    console.debug("LoginState: ", uiState.loginState);
  }, [uiState.loginState]);

  console.debug("Rendering App...");

  return (
    <ThemeProvider theme={THEME}>
      <GameContext.Provider value={{state: gameState, controller: gameController}}>
        <UiStateContext.Provider value={{ state: uiState, controller: uiController }}>
          <Router>
            <PageContainer>
              <Routes>
                {/* UGLY but useRoutes "disables" animated transitions */}
                <Route path="/">
                  <Route index element={<PrimaryPanel />} />
                  <Route path="factions">
                    <Route index element={<PrimaryPanel />} />
                    <Route path=":factionId">
                      <Route index element={<PrimaryPanel />} />
                      <Route path="assets">
                        <Route index element={<PrimaryPanel />} />
                        <Route path=":assetId" element={<PrimaryPanel />} />
                      </Route>
                    </Route>
                  </Route>
                  <Route path="locations">
                    <Route index element={<LocationsPanel />} />
                    <Route path=":locationId" element={<LocationsPanel />} />
                  </Route>
                </Route>
              </Routes>
            </PageContainer>
          </Router>
        </UiStateContext.Provider>
      </GameContext.Provider>
    </ThemeProvider>
  );
}

export default App;
