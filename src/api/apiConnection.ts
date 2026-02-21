import api from './apiClient';

export async function getList<T>(requestUri: string): Promise<T[]> {
  const response = await api.get(`${requestUri}`);
  return response.data as T[];
}

export async function getFirst<T>(requestUri: string): Promise<T | undefined> {
  const list = await getList<T>(requestUri);
  return list[0];
}

export async function getSingle<T>(requestUri: string): Promise<T> {
  const response = await api.get(`${requestUri}`);
  console.log(response);
  return response.data as T;
}
export async function post<TRequest, TResponse>(requestUri: string, data: TRequest): Promise<TResponse> {
  const response = await api.post(requestUri, data);
  return response.data as TResponse;
}

export async function put<T>(requestUri: string, data: T): Promise<T> {
  const response = await api.put(`${requestUri}`, data);
  return response.data as T;
}

export async function deleteRequest<T>(requestUri: string, params?: Record<string, unknown>): Promise<T> {
  const response = await api.delete(requestUri, { params });
  return response.data as T;
}

