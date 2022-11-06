import React, { useState } from 'react';
import AddFactionForm from './components/AddFactionForm';
import FactionList from './components/FactionList';
import { GameContext } from './contexts/GameContext';
import { useLocalStorage } from './hooks/useLocalStorage';
import { GameController, IGameController } from './controllers/GameController';
import GameState from './types/GameState';
import { UiState } from './types/UiState';
import { IUiStateController, UiStateController } from './controllers/UiStateController';
import { UiStateContext } from './contexts/UiStateContext';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';

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
            }}
            data-testid="app-root"
          >
            <Box
              sx={{ 
                backgroundColor: "#282c34",
                display: "flex",
                minHeight: "calc(100vh - 6rem)",
                flexDirection: "column",
                alignItems: "stretch",
                fontSize: "calc(10px + 2vmin)",
                padding: "3rem 0",
              }}
              data-testid="app-inner-box"
            >
              <Typography variant="h1" sx={{ textAlign: "center" }}>SWN Faction Tracker</Typography>
              <AddFactionForm />
              <FactionList />
            </Box>
          </Box>
        </UiStateContext.Provider>
      </GameContext.Provider>
    </ThemeProvider>
  );
}

export default App;
