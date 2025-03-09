import { renderHook, act } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import { useInfinitePhotos } from './useInfinitePhotos';
import { useApi } from '../';

jest.mock('../', () => ({
  useApi: jest.fn(),
}));

describe('useInfinitePhotos hook tests', () => {
  const mockFetchCuratedPhotos = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useApi as jest.Mock).mockReturnValue({
      fetchCuratedPhotos: mockFetchCuratedPhotos,
    });
  });

  it('Should initialize with default values', async () => {
    mockFetchCuratedPhotos.mockResolvedValueOnce({ photos: [{ id: 1, url: 'photo1.jpg' }] });

    const { result } = renderHook(() => useInfinitePhotos());
    await waitFor(() => {
        expect(result.current.photos).toEqual([{ id: 1, url: 'photo1.jpg' }]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.hasMore).toBe(true);
      expect(result.current.setPage).toBeInstanceOf(Function);
    });
  });

  it('Should fetch photos successfully and update state', async () => {
    const mockPhotos = [
      { id: 1, url: 'photo1.jpg' },
      { id: 2, url: 'photo2.jpg' },
    ];
    mockFetchCuratedPhotos.mockResolvedValueOnce({ photos: mockPhotos });
    const { result } = renderHook(() => useInfinitePhotos());

    await waitFor(() => {
      expect(result.current.photos).toEqual(mockPhotos);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.hasMore).toBe(true);
    });

    expect(mockFetchCuratedPhotos).toHaveBeenCalledWith(15, 1); 
  });

  it('Should append new photos and avoid duplicates', async () => {
    const initialPhotos = [{ id: 1, url: 'photo1.jpg' }];
    const newPhotos = [
      { id: 2, url: 'photo2.jpg' },
      { id: 3, url: 'photo3.jpg' },
    ];
    mockFetchCuratedPhotos
      .mockResolvedValueOnce({ photos: initialPhotos })
      .mockResolvedValueOnce({ photos: newPhotos });

    const { result } = renderHook(() => useInfinitePhotos());

    await waitFor(() => {
      expect(result.current.photos).toEqual(initialPhotos);
    });

    act(() => result.current.setPage(2));

    await waitFor(() => {
      expect(result.current.photos).toEqual([...initialPhotos, ...newPhotos]);
    });
  });

  it('Should set hasMore to false if no more photos are returned', async () => {
    mockFetchCuratedPhotos.mockResolvedValueOnce({ photos: [] });

    const { result } = renderHook(() => useInfinitePhotos());

    await waitFor(() => {
      expect(result.current.hasMore).toBe(false);
      expect(result.current.photos).toEqual([]);
    });
  });

  it('Should not fetch photos if already loading or hasMore is false', async () => {
    const { result } = renderHook(() => useInfinitePhotos());

    act(() => {
      result.current.setPage(2);
    });
    
    await waitFor(() => {
      expect(mockFetchCuratedPhotos).toHaveBeenCalledTimes(1);
    });
    
    act(() => {
      result.current.setPage(3);
    });
    
    await waitFor(() => {
      expect(mockFetchCuratedPhotos).not.toHaveBeenCalledTimes(2);
    });
  });
});
