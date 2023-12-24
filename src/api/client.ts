import { Keys, getFromAsyncStorage } from "@utils/AsyncStorage";
import axios, { CreateAxiosDefaults } from "axios";

const client = axios.create({
    baseURL: 'http://192.168.1.137:8989',
})

const baseURL = 'http://192.168.1.137:8989'

type headers = CreateAxiosDefaults<any>['headers']

export const getClient = async (headers?: headers) => {
    const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);

    if(!token) return axios.create({
        baseURL
    })

    const defaultHeader = {
        Authorization: 'Bearer ' + token,
        ...headers
    }

   return  axios.create({baseURL, headers: defaultHeader})
}

export default client