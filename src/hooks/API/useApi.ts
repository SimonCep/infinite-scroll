import { useCallback } from 'react';
import { BASE_URL, PEXELS_API_KEY } from '../../data/constants';
import { type HttpMethod, type CuratedPhotosResponse } from '../../types/api';

interface ApiError {
  status: number;
  message: string;
}

interface UseApiOptions {
  onError?: (error: ApiError) => void;
}

export const useApi = ({ onError }: UseApiOptions = {}) => {
  
  const sendRequest = useCallback(
    async <T>(path: string, method: HttpMethod, body?: any): Promise<T | null> => {
      try {
        const url = `${BASE_URL}${path}`;
        const headers = {
          Authorization: PEXELS_API_KEY,
          ...(body && { 'Content-Type': 'application/json' }),
        };

        const response = await fetch(url, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
          const errorMessage = `API error (${response.status}): ${response.statusText}`;
          if (onError) onError({ status: response.status, message: errorMessage });
          return null;
        }

        return await response.json();
      } catch (error) {
        if (onError) onError({ status: 0, message: 'Network error or server unreachable.' });
        return null;
      }
    },
    [onError]
  );

  const fetchCuratedPhotos = useCallback(
    (perPage = 20, page = 1) =>
    sendRequest<CuratedPhotosResponse>(`/curated?per_page=${perPage}&page=${page}`, 'GET'
    ),
    [sendRequest]
  );

  return { fetchCuratedPhotos };
}
