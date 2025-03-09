import { renderHook } from '@testing-library/react';
import { useApi } from './useApi';

// Mock the constants directly
jest.mock('../../data/constants', () => ({
  BASE_URL: 'api url',
  PEXELS_API_KEY: 'api key',
}));

describe('useApi', () => {
  const mockOnError = jest.fn();
  const mockResponse = {
    photos: [],
    page: 1,
    per_page: 20,
    total_results: 100,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch curated photos successfully', async () => {
    globalThis.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const { result } = renderHook(() => useApi({ onError: mockOnError }));

    const data = await result.current.fetchCuratedPhotos(20, 1);

    expect(globalThis.fetch).toHaveBeenCalledWith('api url/curated?per_page=20&page=1', {
      method: 'GET',
      headers: {
        Authorization: 'api key',
      },
      body: undefined,
    });
    expect(data).toEqual(mockResponse);
    expect(mockOnError).not.toHaveBeenCalled();
  });

  it('should handle API errors correctly', async () => {
    globalThis.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    const { result } = renderHook(() => useApi({ onError: mockOnError }));

    const data = await result.current.fetchCuratedPhotos(20, 1);

    expect(globalThis.fetch).toHaveBeenCalledWith('api url/curated?per_page=20&page=1', {
      method: 'GET',
      headers: {
        Authorization: 'api key',
      },
      body: undefined,
    });
    expect(data).toBeNull();
    expect(mockOnError).toHaveBeenCalledWith({
      status: 404,
      message: 'API error (404): Not Found',
    });
  });

  it('should handle network errors correctly', async () => {
    globalThis.fetch = jest.fn().mockRejectedValueOnce(new Error('Network Error'));

    const { result } = renderHook(() => useApi({ onError: mockOnError }));

    const data = await result.current.fetchCuratedPhotos(20, 1);

    expect(globalThis.fetch).toHaveBeenCalledWith('api url/curated?per_page=20&page=1', {
      method: 'GET',
      headers: {
        Authorization: 'api key',
      },
      body: undefined,
    });
    expect(data).toBeNull();
    expect(mockOnError).toHaveBeenCalledWith({
      status: 0,
      message: 'Network error or server unreachable.',
    });
  });
});
