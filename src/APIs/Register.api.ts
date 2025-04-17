import { post } from "../Util/ApiManager"
import { HostEndpoint, REGISTER } from "../Util/Endpoint"

export const callRegisterPost = (registerData: FormData) => {
    return post(`${HostEndpoint}${REGISTER}`,registerData);
}  