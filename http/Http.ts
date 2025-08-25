import { getLocale, getToken } from "@/helpers/helpers";
import { ApiErrorType, ApiResponse } from "@/http/Response";
import AppConfig from "@/lib/Config";
import axios, { AxiosError, AxiosResponse } from "axios";

export const GET = async <T>(
  url: string,
  params?: object,
  headers?: object,
): Promise<ApiResponse<T>> => {
  return await http("GET", url, headers, params);
};

export const POST = async <T>(
  url: string,
  data: any,
  headers?: object,
): Promise<ApiResponse<T>> => {
  return await http("POST", url, headers, undefined, data);
};

export const PUT = async <T>(
  url: string,
  data: any,
  headers?: object,
): Promise<ApiResponse<T>> => {
  return await http("PUT", url, headers, undefined, data);
};

export const DELETE = async <T>(
  url: string,
  params?: object,
  headers?: object,
): Promise<ApiResponse<T>> => {
  return await http("DELETE", url, headers, params);
};

const http = async <T>(
  method: string,
  url: string,
  headers?: object,
  params?: object,
  data?: object | undefined,
): Promise<ApiResponse<T>> => {
  let lang = await getLocale();
  const token = await getToken();
  const h = {
    "Content-Type": "multipart/form-data",
    Accept: "application/json",
    "Accept-Language": `${lang ?? "en"}`,
    Authorization: `Bearer ${token}`,
    "Access-Control-Allow-Origin": "*",
  };

  const config = {
    headers: { ...headers, ...h },
    params: params,
    baseURL: AppConfig.BACKEND_URL,
    url: url,
  };
  try {
    let response: AxiosResponse;
    switch (method) {
      case "GET":
        response = await axios.get(url, config);
        break;
      case "POST":
        response = await axios.post(url, data, config);
        break;
      case "PUT":
        response = await axios.post(url, { _method: "PUT", ...data }, config);
        break;
      case "DELETE":
        response = await axios.delete(url, config);
        break;
      default:
        response = await axios.get(url, config);
        break;
    }

    return new ApiResponse(
      response.data.data ?? null,
      response.data.status ?? null,
      response.data.code ?? 500,
      response.data.message ?? null,
      response.data.paginate ?? null,
    );
  } catch (error: any) {
    console.error(error);
    return handleError(error);
  }
};

function handleError<T>(error: AxiosError<ApiResponse<T>>): ApiResponse<T> {
  if (error.request) {
    if (error.response?.status == 405 || error.response?.data.code == 405) {
      return new ApiResponse<T>(
        null as T,
        false,
        405,
        error.response.data.message,
      );
    }
    return new ApiResponse<T>(
      null as T,
      false,
      error.response?.data.code ?? error.response?.status ?? 400,
      error.response?.data?.message,
    );
  } else {
    return new ApiResponse<T>(
      null as T,
      false,
      400,
      ApiErrorType.UNKNOWN_ERROR,
    );
  }
}
