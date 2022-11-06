import React from 'react';
import Box from '@mui/material/Box';
import { createTheme, ThemeOptions, ThemeProvider } from '@mui/material/styles'
import Typography from '@mui/material/Typography';
import AddFactionForm from './components/AddFactionForm';
import FactionList from './components/FactionList';
import { GameContext } from './GameContext';
import { useLocalStorage } from './hooks/useLocalStorage';
import { createController, IGameController } from './GameController';
import GameState from './types/GameState';
import './App.css';

function App() {

  const [state, setState] = useLocalStorage<GameState>(
    "Faction-GameState", 
    { isLoading: false, factions: {}, }) as 
      [state: GameState, setState: React.Dispatch<React.SetStateAction<GameState>>];

  const controller: IGameController = createController(setState);

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
        <Box className="App">
          <Box className="App-content">
            <Typography fontSize={32}>SWN Faction Tracker</Typography>
            <Box>
              <AddFactionForm />
            </Box>
            <Box>
              <FactionList />
            </Box>
          </Box>
        </Box>
      </GameContext.Provider>
    </ThemeProvider>
  );
}

export default App;
