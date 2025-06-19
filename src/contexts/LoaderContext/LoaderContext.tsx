import { createContext, useReducer } from "react";
import { Disptch, InitialState, LoaderReducer, LoaderType } from "./Loader.reducer";

export const LoaderContext = createContext<{state: LoaderType, dispatch: Disptch} | undefined>(undefined);

type LoaderProviderType = {
    children: React.ReactNode
}

export const LoaderProvider = ({children}: LoaderProviderType) => {
    const [state, dispatch] = useReducer(LoaderReducer,InitialState);
    const value = {state,dispatch};

    return <LoaderContext.Provider value={value}>
        {children}
    </LoaderContext.Provider>
}
