import { createContext, useReducer } from "react";
import { AuthReducer, Disptch, InitialState, InitialStateType } from "./Auth.reducer";

export const AuthContext = createContext<{state: InitialStateType, dispatch: Disptch} | undefined>(undefined);

type AuthProviderType = {
    children: React.ReactNode
}

export const AuthProvider = ({children}:AuthProviderType) => {
    const [state, dispatch] = useReducer(AuthReducer,InitialState);
    const value = {state,dispatch};
    
    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}