import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { useError } from './errorContext'

const useApi = () => {
    const { setError } = useError();

    const baseURL = process.env.NODE_ENV === 'production'
        ? 'http://localhost:8000'
        : 'http://localhost:8000';

    const api = axios.create({
        baseURL: baseURL,
    });

    const request = async <T>(config: AxiosRequestConfig): Promise<T | null> => {
        try {
            const response: AxiosResponse<T> = await api.request(config);
            return response.data;
        } catch (error: any) {
            const message = error.response?.data;
            if (message) {
                setError(message);
            } else {
                setError('Oops, something went wrong')
            }
            setTimeout(() => {
                setError('')
            }, 2000);
            
            return null;
        }
    };

    return request;
};

export default useApi;
