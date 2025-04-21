type PayloadType = {
    email: string
}

export type InitialStateType = {
    logedIn: boolean,
    payload: PayloadType
}

export const InitialState: InitialStateType = {
    logedIn: false,
    payload:{
        email: ''
    }
}

type Action = {
        type: 'login',
        payload:{
            email: string
        }
    } | 
    {type: 'logout'} | 
    {
        type: 'load', 
        payload:{
            email: string
        }
    };

export type Disptch = (action: Action) => void;

export const AuthReducer = (state:InitialStateType, action:Action): InitialStateType => {
    switch(action.type){
        case 'login': {
            return{
                ...state,
                logedIn: true,
                payload: action.payload
            };
        }
        case 'logout': {
            return{
                ...state,
                logedIn: false,
                payload: {
                    email: ''
                }
            }
        }
        case 'load': {
            return{
                ...state,
                logedIn: true,
                payload: action.payload
            }
        }
        default:
            return state;
    }
}