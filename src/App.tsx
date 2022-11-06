import React from 'react';
import { GameContext } from './contexts/GameContext/GameContext';
import { useLocalStorage } from './hooks/useLocalStorage';
import { GameController, IGameController } from './controllers/GameController/GameController';
import StoredGameState from './types/StoredGameState';
import { UiState } from './types/UiState';
import { IUiStateController, UiStateController } from './controllers/UiStateController/UiStateController';
import { UiStateContext } from './contexts/UiStateContext/UiStateContext';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import Box from '@mui/material/Box';
import { createTheme } from '@mui/material/styles';
import PrimaryPanel from './components/PrimaryPanel/PrimaryPanel';
import RuntimeGameState from './types/RuntimeGameState';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LocationsPanel from './components/LocationsPanel/LocationsPanel';

function App() {
  const [storedState, setStoredState] = useLocalStorage<StoredGameState>("Faction-GameState", 
    {
      factions: [],
      factionOrder: [],
      assets: []
    }
  );

  const gameState: RuntimeGameState = new RuntimeGameState(storedState);
  const gameController: IGameController = new GameController(gameState, setStoredState);

  const [uiState, setUiState] = useLocalStorage<UiState>("Faction-UiState", 
    {
      selectedFaction: null,
      selectedAssetKey: null,
      hasFactionSelected: false,
    }
  );
  const uiController: IUiStateController = new UiStateController(setUiState);

  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#38ABF5',
      },
      secondary: {
        main: '#00C823',
      },
      background: {
        default: "#282c34",
        paper: "#383c44",
        paper2: "#484c54",
        paper3: "#50546c",
      }
    },
    typography: {
      body1: {
        fontSize: "1rem",
      },
      body2: {
        fontSize: "0.85rem",
      },
      h1: {
        fontSize: "2.5rem"
      },
      h2: {
        fontSize: "2.25rem"
      },
      h3: {
        fontSize: "2rem"
      },
      h4: {
        fontSize: "1.75rem"
      },
      h5: {
        fontSize: "1.5rem"
      },
      h6: {
        fontSize: "1.75rem"
      }
    },
    components: {
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: "1rem"
          }
        }
      }
    }
  });

  console.debug("Rendering App...");

  return (
    <ThemeProvider theme={theme}>
      <GameContext.Provider value={{state: gameState, controller: gameController}}>
        <UiStateContext.Provider value={{ state: uiState, controller: uiController }}>
          <Router>
            <Box
              sx={{
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.background.default,
              }}
              data-testid="app-root"
            >
                <Routes>
                  <Route path="/">
                    <PrimaryPanel />
                  </Route>
                  <Route path="/locations">
                    <LocationsPanel />
                  </Route>
                </Routes>
            </Box>
          </Router>
        </UiStateContext.Provider>
      </GameContext.Provider>
    </ThemeProvider>
  );
}

export default App;
