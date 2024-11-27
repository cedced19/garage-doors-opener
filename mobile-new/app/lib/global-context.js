import React, { createContext, useEffect, useState } from 'react';

// Create the Context
export const GlobalContext = createContext();

// Create a Provider component
export const GlobalProvider = ({ children }) => {
  // Example global state
  const [currentGarage, setCurrentGarage] = useState(null);
  const [garages, setGarages] = useState([]);
  const [garageDefined, setGarageDefined] = useState(false);

  // Example method to update the state
  const defineCurrentGarage = (currentGarage) => {
    setCurrentGarage(currentGarage);
    setGarageDefined(true);
  };

  const removeCurrentGarage = () => {
    setCurrentGarage(null);
    setGarageDefined(false);
  };

  return (
    <GlobalContext.Provider value={{ currentGarage, garageDefined, defineCurrentGarage, removeCurrentGarage, garages, setGarages }}>
      {children}
    </GlobalContext.Provider>
  );
};