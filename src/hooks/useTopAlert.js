import { createContext, useContext } from 'react';

export const TopAlertContext = createContext({
  showAlert: () => {},
  hideAlert: () => {},
});

export const useTopAlert = () => useContext(TopAlertContext);
