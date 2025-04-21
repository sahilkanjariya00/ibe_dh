import axios from "axios";
// import { getData } from "./Helper";

// axios.interceptors.request.use(
//   config => {

//     const localData = getData("loginData");
//     if (localData?.token) {
//       config.headers!['Authorization'] = 'Bearer ' + localData.token
//     }
//     config.headers!['Content-Type'] = 'application/json';
//     return config
//   },

//   error => {
//     Promise.reject(error)
//   }
// )

export const post = (url: string, data: any) => {
  return axios.post(`${url}`, data);
};

export const get = (url: string) => {
  return axios.get(`${url}`)
}