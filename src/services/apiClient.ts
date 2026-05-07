import { API_URL } from '@/lib/constants';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static async fromResponse(response: Response): Promise<ApiError> {
    let data: Record<string, unknown> = {};
    try {
      data = await response.json();
    } catch {
      data = {};
    }
    return new ApiError(
      (data.error as string) || (data.message as string) || 'Request failed',
      response.status,
      data
    );
  }
}

interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
}

async function request<T>(
  endpoint: string,
  config: RequestConfig = {},
  baseUrl: string = API_URL
): Promise<T> {
  const { method = 'GET', headers = {}, body } = config;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const requestHeaders: Record<string, string> = { ...defaultHeaders, ...headers };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${baseUrl}${endpoint}`, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw await ApiError.fromResponse(response);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export function createApiClient(token: string | null) {
  const authHeaders: Record<string, string> = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  return {
    get<T>(endpoint: string, baseUrl?: string): Promise<T> {
      return request<T>(endpoint, { method: 'GET', headers: authHeaders }, baseUrl);
    },

    post<T>(endpoint: string, body?: unknown, baseUrl?: string): Promise<T> {
      return request<T>(endpoint, { method: 'POST', headers: authHeaders, body }, baseUrl);
    },

    put<T>(endpoint: string, body?: unknown, baseUrl?: string): Promise<T> {
      return request<T>(endpoint, { method: 'PUT', headers: authHeaders, body }, baseUrl);
    },

    patch<T>(endpoint: string, body?: unknown, baseUrl?: string): Promise<T> {
      return request<T>(endpoint, { method: 'PATCH', headers: authHeaders, body }, baseUrl);
    },

    delete<T>(endpoint: string, baseUrl?: string): Promise<T> {
      return request<T>(endpoint, { method: 'DELETE', headers: authHeaders }, baseUrl);
    },
  };
}

export async function safeRequest<T>(
  endpoint: string,
  token: string | null,
  options: RequestConfig = {}
): Promise<{ data: T | null; error: ApiError | null }> {
  try {
    const client = createApiClient(token);
    const data = await (options.method === 'POST' || !options.method
      ? client.post<T>(endpoint, options.body)
      : options.method === 'PUT'
        ? client.put<T>(endpoint, options.body)
        : options.method === 'PATCH'
          ? client.patch<T>(endpoint, options.body)
          : options.method === 'DELETE'
            ? client.delete<T>(endpoint)
            : client.get<T>(endpoint));
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err as ApiError };
  }
}