import React, { useContext } from "react";
import { GameContext } from "../contexts/GameContext";

export default function LocationsPanel() {
  const { state, controller } = useContext(GameContext);

  return (
    <>Locations Panel</>
  );
}
