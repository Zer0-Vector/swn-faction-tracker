import Box from '@mui/material/Box';
import { createTheme, ThemeOptions, ThemeProvider } from '@mui/material/styles'
import Typography from '@mui/material/Typography';
import React from 'react';
import './App.css';
import AddFactionForm from './components/AddFactionForm/AddFactionForm';
import FactionList from './components/FactionList/FactionList';
import { GameContext, GameController } from './components/GameContext';
import { useLocalStorage } from './components/useLocalStorage';
import FactionInfo from './types/FactionInfo';
import GameState from './types/GameState';

function App() {

  const [state, setState] = useLocalStorage<GameState>(
    "Faction-GameState", 
    { isLoading: false, factions: {}, }) as 
      [state: GameState, setState: React.Dispatch<React.SetStateAction<GameState>>];

  const controller: GameController = {
    addFaction: (faction: FactionInfo) => {
      console.log("Adding Faction: " + faction.name)
      if (faction.name.trim().length > 0) {
        setState(state => {
          let factions = state.factions;
          if (Object.keys(factions).includes(`${faction.name}`)) {
            console.warn("Overwriting faction: ", faction);
          }
  
          factions = {
            ...factions,
            [faction.name]: faction,
          };
          
          return {
            ...state,
            factions: factions,
          };
        });
      }
    },
    removeFaction: (name: string) => {
      console.log("Removing faction: " + name);
      setState(state => {
        const stateCopy = { ...state };
        delete stateCopy.factions[name];
        return stateCopy
      });
    },
  };

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
  };

  const theme = createTheme(themeOptions);
  
  return (
    <ThemeProvider theme={theme}>
      <GameContext.Provider value={{state, controller} as {state: GameState, controller: GameController}}>
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
