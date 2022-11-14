import React, { useMemo } from 'react';
import { BrowserRouter as Router, Route,Routes } from "react-router-dom";

import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
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

  console.debug("Rendering App...");

  return (
    <ThemeProvider theme={THEME}>
      <GameContext.Provider value={{state: gameState, controller: gameController}}>
        <UiStateContext.Provider value={{ state: uiState, controller: uiController }}>
          <Router>
            <CssBaseline />
            <Box data-testid="app-root">
              <PageContainer>
                <Routes>
                  <Route path="/" element={<PrimaryPanel />} />
                  <Route path="/locations" element={<LocationsPanel />} />
                </Routes>
              </PageContainer>
            </Box>
          </Router>
        </UiStateContext.Provider>
      </GameContext.Provider>
    </ThemeProvider>
  );
}

export default App;
