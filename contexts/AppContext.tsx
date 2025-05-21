import { createContext, useContext, useReducer } from 'react'

type State = {
  user: null | Record<string, unknown>;
  theme: 'light' | 'dark';
  language: string;
}

type Action = 
  | { type: 'SET_USER'; payload: Record<string, unknown> }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'SET_LANGUAGE'; payload: string }

const AppContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
} 