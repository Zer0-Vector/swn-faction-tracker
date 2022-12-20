import React, { useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import ThemeProvider from '@mui/material/styles/ThemeProvider';

import { AuthContext } from './contexts/AuthContext';
import { DataProvider } from './contexts/providers/DataProvider';
import { UiStateContext } from './contexts/UiStateContext';
import { IUiStateController, UiStateController } from './controllers/UiStateController';
import { useAuthProvider } from './hooks/useAuthProvider';
import { useLocalStorage } from './hooks/useLocalStorage';
import LocationsPanel from './pages/LocationsPanel';
import PrimaryPanel from './pages/PrimaryPanel';
import { THEME } from './style/Theme';
import PageContainer from './templates/PageContainer';
import UiState from './types/UiState';

function App() {
  const [uiState, setUiState] = useLocalStorage<UiState>("Faction-UiState", 
    {
      loginState: "LOGGED_OUT",
      editMode: "VIEW",
    }
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const uiController: IUiStateController = useMemo(() => new UiStateController(setUiState), []);

  useEffect(() => {
    console.debug("LoginState: ", uiState.loginState);
  }, [uiState.loginState]);

  const auth = useAuthProvider(uiController);

  console.debug("Rendering App...");

  return (
    <ThemeProvider theme={THEME}>
      <DataProvider>
        <UiStateContext.Provider value={{ state: uiState, controller: uiController }}>
          <AuthContext.Provider value={auth}>
            <Router>
              <PageContainer>
                <Routes>
                  {/* UGLY is there another way???? */}
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
          </AuthContext.Provider>
        </UiStateContext.Provider>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;
