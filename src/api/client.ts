import { SERVER } from "@/configs/env";
import { ERROR_MESSAGES } from "@/utils/constants";
import {
  apiAsyncHandler,
  getTokenSync,
  isNotEmptyObject,
} from "@/utils/helpers";

const BASE_URL = SERVER.URL;

export const METHODS = {
  POST: "POST",
  GET: "GET",
  DELETE: "DELETE",
  PUT: "PUT",
  PATCH: "PATCH",
  HEAD: "HEAD",
  OPTIONS: "OPTIONS",
};

const client = async ({
  url = "",
  method = "GET",
  data = {},
  cookieToken = "",
  headers = {},
  ...rest
}: {
  method: string;
  url: string;
  cookieToken?: string;
  headers?: Record<string, string>;
  data?: {
    params?: any;
    [key: string]: unknown;
  };
  rest?: Record<string, unknown>;
}) => {
  let fullUrl = `${BASE_URL}${url}`;
  let token = cookieToken;

  const { params, ...restData } = data;

  // Handle query params
  if (isNotEmptyObject(params)) {
    const queryParams = Object.fromEntries(
      Object.entries(params).map(([key, value]) => [key, String(value)])
    );
    const queryString = new URLSearchParams(queryParams).toString();
    fullUrl += `?${queryString}`;
  }

  // ✅ On server, read cookies via `next/headers`
  if (!token && typeof window !== "undefined") {
    const tokenCookie = getTokenSync();
    token = tokenCookie || "";
  }

  const fetchOptions: RequestInit = {
    method,
    headers: {
      ...(data instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(token ? { Cookie: `${token}` } : {}),
      ...headers,
    },
    credentials: "include",
    ...rest,
  };

  if (restData && method !== METHODS.GET) {
    fetchOptions.body =
      data instanceof FormData ? data : JSON.stringify(restData);
  }

  return await apiAsyncHandler(
    async () => {
      const res = await fetch(fullUrl, fetchOptions);
      const isJSON = res.headers
        .get("Content-Type")
        ?.includes("application/json");
      const responseType = isJSON ? await res.json() : await res.text();

      if (res.ok) {
        return { status: res?.status, data: responseType };
      } else {
        const { data, error } = responseType || {};
        const status: number = res?.status;

        const message =
          responseType?.message ||
          ERROR_MESSAGES[String(status) as keyof typeof ERROR_MESSAGES] ||
          ERROR_MESSAGES.common;

        throw {
          status,
          message,
          data,
          apiError: error || {},
        };
      }
    },
    (error) => {
      throw error;
    }
  );
};

export default client;
