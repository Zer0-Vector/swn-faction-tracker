import React, { useState } from 'react';
import { GameContext } from './contexts/GameContext';
import { useLocalStorage } from './hooks/useLocalStorage';
import { GameController, IGameController } from './controllers/GameController';
import GameState from './types/GameState';
import { UiState } from './types/UiState';
import { IUiStateController, UiStateController } from './controllers/UiStateController';
import { UiStateContext } from './contexts/UiStateContext';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import Box from '@mui/material/Box';
import { createTheme } from '@mui/material/styles';
import PrimaryPanel from './components/PrimaryPanel';

function App() {
  const [gameState, setGameState] = useLocalStorage<GameState>("Faction-GameState", 
    {
      isLoading: false,
      factions: {},
      factionOrder: [],
  });
  const gameController: IGameController = new GameController(setGameState);

  const [uiState, setUiState] = useState<UiState>({
    selectedFaction: null,
    selectedAsset: null
  });
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
        paper: "#383c44"
      }
    },
    typography: {
      body1: {
        fontSize: "1rem",
      },
      body2: {
        fontSize: "1rem",
      },
      h1: {
        fontSize: "4rem"
      },
      h2: {
        fontSize: "3.5rem"
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

  return (
    <ThemeProvider theme={theme}>
      <GameContext.Provider value={{state: gameState, controller: gameController}}>
        <UiStateContext.Provider value={{ state: uiState, controller: uiController }}>
          <Box
            sx={{
              color: theme.palette.text.primary,
              backgroundColor: theme.palette.background.default,
            }}
            data-testid="app-root"
          >
            <PrimaryPanel />
          </Box>
        </UiStateContext.Provider>
      </GameContext.Provider>
    </ThemeProvider>
  );
}

export default App;
