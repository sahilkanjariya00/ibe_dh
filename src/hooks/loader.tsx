import { useContext } from "react"
import { LoaderContext } from "../contexts"

const useLoaderContext = () => {
    const context = useContext(LoaderContext);

    if(!context){
        throw Error("useLoader is used outside of loader context");
    }

    return context;
}

export default useLoaderContext;