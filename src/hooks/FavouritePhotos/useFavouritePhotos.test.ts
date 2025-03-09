import { renderHook, act } from '@testing-library/react';
import { useFavouritePhotos } from './useFavouritePhotos';

const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useFavouritePhotos hooks tests', () => {
  const storageKey = 'favourites';

  beforeEach(() => {
    localStorageMock.clear(); // Clear the mocked localStorage before each test
    jest.clearAllMocks(); // Reset all mocks
  });

  it('Should initialize with an empty array if no data is in localStorage', () => {
    const { result } = renderHook(() => useFavouritePhotos(storageKey));

    expect(result.current.favourites).toEqual([]);
    expect(localStorage.getItem).toHaveBeenCalledWith(storageKey);
  });

  it('Should initialize with data from localStorage if it exists', () => {
    const mockFavourites = [1, 2, 3];
    localStorage.setItem(storageKey, JSON.stringify(mockFavourites));

    const { result } = renderHook(() => useFavouritePhotos(storageKey));

    expect(result.current.favourites).toEqual(mockFavourites);
    expect(localStorage.getItem).toHaveBeenCalledWith(storageKey);
  });

  it('Should add a photo ID to favourites when toggled', () => {
    const { result } = renderHook(() => useFavouritePhotos(storageKey));

    act(() => {
      result.current.toggleFavourite(1);
    });

    expect(result.current.favourites).toEqual([1]);
    expect(localStorage.setItem).toHaveBeenCalledWith(storageKey, JSON.stringify([1]));
  });

  it('Should remove a photo ID from favourites when toggled again', () => {
    const initialFavourites = [1];
    localStorage.setItem(storageKey, JSON.stringify(initialFavourites));

    const { result } = renderHook(() => useFavouritePhotos(storageKey));

    act(() => {
      result.current.toggleFavourite(1);
    });

    expect(result.current.favourites).toEqual([]);
    expect(localStorage.setItem).toHaveBeenCalledWith(storageKey, JSON.stringify([]));
  });

  it('Should add multiple photo IDs to favourites', () => {
    const { result } = renderHook(() => useFavouritePhotos(storageKey));

    act(() => {
      result.current.toggleFavourite(1);
      result.current.toggleFavourite(2);
      result.current.toggleFavourite(3);
    });

    expect(result.current.favourites).toEqual([1, 2, 3]);
    expect(localStorage.setItem).toHaveBeenLastCalledWith(storageKey, JSON.stringify([1, 2, 3]));
  });

  it('Should persist updated favourites in localStorage', () => {
    const { result } = renderHook(() => useFavouritePhotos(storageKey));

    act(() => {
      result.current.toggleFavourite(1);
      result.current.toggleFavourite(2);
    });

    const storedFavourites = JSON.parse(localStorage.getItem(storageKey) || '[]');
    expect(storedFavourites).toEqual([1, 2]);
  });
});
