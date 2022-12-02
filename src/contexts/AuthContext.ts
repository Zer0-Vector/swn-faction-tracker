import { createContext } from "react";

import { ProvidedAuth } from "../types/ProvidedAuth";

export const AuthContext = createContext<ProvidedAuth>({} as ProvidedAuth);
