import { createContext, useReducer } from 'react'

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

const initialState: State = {
  user: null,
  theme: 'light',
  language: 'fr',
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    default:
      return state;
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
} 