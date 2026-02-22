import axios, { AxiosError } from 'axios';

// Use same-origin proxy to avoid CORS (see next.config.ts rewrites). Fallback to direct URL for server-side.
const getBaseURL = () =>
    typeof window !== "undefined" ? "/api-backend" : "http://localhost:8000";

const api = axios.create({
    baseURL: getBaseURL(),
});

export const addService = async (service: any) => {
    try{
        const response = await api.post('api/v1/create/', service,{withCredentials: true});
        return response.data;
    }catch(error){
        return {
            success: false,
            message: error instanceof Error ? error.message : 'An unknown error occurred',
            status: (error as AxiosError).response?.status || 500,
        }
    }
};

export const updateService = async (service: any) => {
    try{
        const response = await api.patch(`api/v1/${service.id}/`, service,{withCredentials: true});
        return response.data;
    }catch(error){
        return {
            success: false,
            message: error instanceof Error ? error.message : 'An unknown error occurred',
            status: (error as AxiosError).response?.status || 500,
        }
    }
};

export const deleteService = async (service: any) => {
    try{
        const response = await api.delete(`api/v1/delete/${service.id}/`);
        return response.data;
    }catch(error){
        return {
            success: false,
            message: error instanceof Error ? error.message : 'An unknown error occurred',
            status: (error as AxiosError).response?.status || 500,
        }
    }
};

export const bulkuploadServices = async (services: any)=>{
    try{
        const response = await api.post('api/v1/bulkupload/', services,{withCredentials: true});
        return response.data;
    }catch(error){
        return {
            success: false,
            message: error instanceof Error ? error.message : 'An unknown error occurred',
            status: (error as AxiosError).response?.status || 500,
        }
    }
}

export const postAuthServices = async (auth: any)=>{
    try{
        console.log("starting post auth services");
        const response = await api.post('api/login/', auth,{withCredentials: true});
        console.log("response", response.data);
        return response.data;
    }catch(error){
        console.log("error", error);
        return (error as AxiosError).response?.data;
    }
}