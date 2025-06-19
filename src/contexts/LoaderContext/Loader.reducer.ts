
export type LoaderType = {
    loading: boolean,
}

export const InitialState: LoaderType = {
    loading: false
}

type LoaderActionType = {
    type: 'showloader'
} | 
{type: 'hideloader'};

export type Disptch = (action: LoaderActionType) => void;

export const LoaderReducer = (state: LoaderType, action: LoaderActionType): LoaderType => {
    switch(action.type){
        case 'showloader':
            return {loading: true}
        case 'hideloader':
            return {loading: false}
        default:
            return state
    }
}