import axios from "axios";
import { STORAGE_KEYS } from "./constants/storage-keys";
import { getCookie } from "../utils/cookie";

let router;
export const setRouter = (routerInstance) => {
    router = routerInstance;
};

export const navigateTo = (path) => {
    if (router) {
        router.navigate(path);
    } else {
        console.error('Router is not initialized');
    }
};



const defaultBaseUrl = import.meta.env.DEV
    ? "http://localhost:4101/api/v1/"
    : "https://lopon.ir/api/v1/";

const Base_url = import.meta.env.VITE_API_BASE_URL || defaultBaseUrl;

export const httpService = axios.create({
    baseURL: Base_url
})

export const httpsInterceptedService = axios.create({
    baseURL: Base_url
})

httpsInterceptedService.interceptors.request.use(
    async (config) => {
        const token = getCookie(STORAGE_KEYS.AUTH_TOKEN);
        if (token) {
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${token}`
            }
        }
        return config
    }, (error) => Promise.reject(error)
)

httpsInterceptedService.interceptors.response.use(
    (res) => res,
    async (error) => {
        if (error?.response?.status === 401) {
            if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
                navigateTo('/login');
            }
        }
        return Promise.reject(error);
    }
);


