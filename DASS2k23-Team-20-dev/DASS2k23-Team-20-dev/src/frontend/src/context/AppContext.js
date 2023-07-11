import React, {createContext} from 'react';
import { AuthProvider } from './AuthContext';
import { TicketProvider } from './TicketContext';

export const AppContext = createContext();

export const AppProvider = ({children}) => {
  return(
    <AuthProvider>
      <TicketProvider>
        {children}
      </TicketProvider>
    </AuthProvider>
  )
}