import React, { useContext } from 'react'
import { AuthContext } from '../contexts'

const useAuthContext = () => {
    const context = useContext(AuthContext);

    if(!context){
        throw Error("useAuth is used outside of auth context");
    }
    
    return context;
};

export default useAuthContext;