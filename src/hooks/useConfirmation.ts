import { useContext } from "react";

import { ConfirmationContext } from "../contexts/ConfirmationContext";

export const useConfirmation = () => useContext(ConfirmationContext);
