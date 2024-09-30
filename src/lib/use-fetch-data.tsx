// import { useCallback } from 'react';
// import axios from 'axios';
// import useDialogSessionStore from '@/stores/SessionStore';

// interface useFetchDataProps {
//     endpoint?: string;
//     method?: string;
//     body?: any;
//     type?: string;
//     headers?: any;
// }

// export default function useFetchData() {

//     const baseUrl = import.meta.env.VITE_PUBLIC_API;
//     const token = typeof window !== 'undefined' ? localStorage.getItem("user-auth") : null;

//     return useCallback(async ({
//         endpoint,
//         method = 'GET',
//         body,
//         type,
//         headers = {},
//     }: useFetchDataProps) => {
//         const url = `${baseUrl}${endpoint}`;

//         const config = {
//             method: method,
//             url: url,
//             headers: {
//                 "Content-Type": type === 'json'
//                     ? 'application/json'
//                     : 'application/x-www-form-urlencoded',
//                 Authorization: `Bearer ${token}`, // Include Bearer token if applicable
//                 ...headers
//             },
//             data: body
//         };

//         return axios(config)
//             .then(function (response) {
//                 return response?.data;
//             })
//             .catch(function (error) {
//                 if (error.response) {
//                     if (error.response.status === 401) {
//                         const showDialog = useDialogSessionStore.getState().showDialog
//                         showDialog()
//                     }
//                 } else if (error.request) {
//                     if (error?.request?.status === 403) {
//                         console.log('403 request');
//                     }
//                 } else {
//                     console.error('Error:', error.message);
//                 }
//                 console.log('Config:', error.config);

//                 throw error;
//             });
//     }, [token]);
// };



import { useCallback, useEffect, useState } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import useDialogSessionStore from '@/stores/SessionStore';

interface useFetchDataProps {
    endpoint?: string;
    method?: string;
    body?: any;
    type?: string;
    headers?: any;
}

export default function useFetchData() {

    const [token, setToken] = useState<string | null>(null);
    const baseUrl = import.meta.env.VITE_PUBLIC_API;

    // Load token once on mount and if it changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const authToken = localStorage.getItem("user-auth");
            setToken(authToken);
        }
    }, []);

    // const axiosInstance = axios.create({
    //     baseURL: baseUrl,
    //     timeout: 10000, // 10 seconds timeout
    //     headers: {
    //         'Authorization': token ? `Bearer ${token}` : '',
    //     },
    // });

    return useCallback(async ({
        endpoint,
        method = 'GET',
        body,
        type,
        headers = {},
    }: useFetchDataProps) => {
        const url = `${baseUrl}${endpoint}`;

        const controller = new AbortController(); // Initialize AbortController
        const config: AxiosRequestConfig = {
            url: url,
            method,
            headers: {
                "Content-Type": type === 'json'
                    ? 'application/json'
                    : 'application/x-www-form-urlencoded',
                Authorization: `Bearer ${token}`,
                ...headers
            },
            data: body,
            signal: controller.signal,
        };

        return axios(config)
            .then(function (response) {
                return response?.data;
            })
            .catch(function (error) {
                if (error.response) {
                    if (error.response.status === 401) {
                        const showDialog = useDialogSessionStore.getState().showDialog
                        showDialog()
                    }
                } else if (error.request) {
                    if (error?.request?.status === 403) {
                        console.log('403 request');
                    }
                } else {
                    console.error('Error:', error.message);
                }
                console.log('Config:', error.config);

                throw error;
            });
    }, [token]);
};
