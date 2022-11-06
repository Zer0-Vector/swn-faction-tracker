import React from 'react';
import Box from '@mui/material/Box';
import { createTheme, ThemeOptions, ThemeProvider } from '@mui/material/styles'
import Typography from '@mui/material/Typography';
import AddFactionForm from './components/AddFactionForm';
import FactionList from './components/FactionList';
import { GameContext } from './GameContext';
import { useLocalStorage } from './hooks/useLocalStorage';
import { GameController, IGameController } from './GameController';
import GameState from './types/GameState';

function App() {

  const [state, setState] = useLocalStorage<GameState>(
    "Faction-GameState", 
    { isLoading: false, factions: {}, }) as 
      [state: GameState, setState: React.Dispatch<React.SetStateAction<GameState>>];

  const controller: IGameController = new GameController(setState);

  const themeOptions: ThemeOptions = {
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
  };

  const theme = createTheme(themeOptions);
  
  return (
    <ThemeProvider theme={theme}>
      <GameContext.Provider value={{state, controller} as {state: GameState, controller: IGameController}}>
        <Box 
          sx={{
            textAlign: "center",
            color: "white",
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
            <Typography variant="h1" fontSize={64}>SWN Faction Tracker</Typography>
            <AddFactionForm />
            <FactionList />
          </Box>
        </Box>
      </GameContext.Provider>
    </ThemeProvider>
  );
}

export default App;
