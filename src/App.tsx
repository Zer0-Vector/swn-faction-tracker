import React from 'react';
import { BrowserRouter as Router, Route,Routes } from "react-router-dom";

import Box from '@mui/material/Box';
import { createTheme } from '@mui/material/styles';
import ThemeProvider from '@mui/material/styles/ThemeProvider';

import LocationsPanel from './components/LocationsPanel';
import PageContainer from './components/PageContainer';
import PrimaryPanel from './components/PrimaryPanel';
import { GameContext } from './contexts/GameContext';
import { UiStateContext } from './contexts/UiStateContext';
import { GameController, IGameController } from './controllers/GameController';
import { IUiStateController, UiStateController } from './controllers/UiStateController';
import { useLocalStorage } from './hooks/useLocalStorage';
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
    }
  );

  const gameState: RuntimeGameState = new RuntimeGameState(storedState);
  const gameController: IGameController = new GameController(gameState, setStoredState);

  const [uiState, setUiState] = useLocalStorage<UiState>("Faction-UiState", 
    {
      selectedFaction: null,
      selectedAssetKey: null,
      selectedLocation: null,
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
