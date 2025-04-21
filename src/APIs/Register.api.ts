import { AxiosResponse } from "axios";
import { post } from "../Util/ApiManager"
import { HostEndpoint, REGISTER, VERIFY } from "../Util/Endpoint"

type RegisterResponseType = {
    message: string,
    public_key: string,
    encrypted_private_key: string,
    encryption_salt: string,
}

type VerifyResponseType = {
    message: string,
    public_key: string
}

export const callRegisterPost = (registerData: FormData):Promise<AxiosResponse<RegisterResponseType>> => {
    return post(`${HostEndpoint}${REGISTER}`,registerData);
} 

export const callVerifyPost = (verifyPayload: FormData):Promise<AxiosResponse<VerifyResponseType>> => {
    return post(`${HostEndpoint}${VERIFY}`, verifyPayload);
}