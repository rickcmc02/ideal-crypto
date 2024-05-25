import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

const axiosInstance = axios.create();

export interface HttpClient extends AxiosInstance {
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = unknown>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T>;
}

export const http: HttpClient = axiosInstance;

http.interceptors.response.use((res) => res.data);
