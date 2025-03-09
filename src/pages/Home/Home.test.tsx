import { useInfinitePhotos, useFavouritePhotos } from '../../hooks';
import { render, screen } from '@testing-library/react';
import Home from './Home';

jest.mock('../../hooks', () => ({
    useInfinitePhotos: jest.fn(),
    useFavouritePhotos: jest.fn()
}));

jest.mock('../../components', () => ({
    PhotoCard: ({ photo }: { photo: any; isFavourite: boolean; toggleFavourite: () => void }) => (
        <div data-testid="photo-card">{photo.id}</div>
    )
}));

let intersectionObserverInstance: IntersectionObserverMock | null = null;

class IntersectionObserverMock implements IntersectionObserver {
    callback: IntersectionObserverCallback;
    root: Element | null = null;
    rootMargin: string = '0px';
    thresholds: ReadonlyArray<number> = [];

    constructor(callback: IntersectionObserverCallback) {
        this.callback = callback;
        intersectionObserverInstance = this;
    }

    observe = jest.fn();
    disconnect = jest.fn();
    unobserve = jest.fn();
    takeRecords = jest.fn(() => []);

    trigger(entries: IntersectionObserverEntry[]) {
        this.callback(entries, this);
    }
}

describe('Home page tests', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        intersectionObserverInstance = null;
        (window as any).IntersectionObserver = IntersectionObserverMock;
    });

    test('Should render error message when error exists', () => {
        (useInfinitePhotos as jest.Mock).mockReturnValue({
            photos: [],
            loading: false,
            error: 'no photos',
            hasMore: false,
            setPage: jest.fn()
        });
        (useFavouritePhotos as jest.Mock).mockReturnValue({
            favourites: [],
            toggleFavourite: jest.fn()
        });

        render(<Home />);
        expect(screen.getByText(/Error: no photos/i)).toBeInTheDocument();
    });

    test('Should render photo cards when photos are provided', () => {
        (useInfinitePhotos as jest.Mock).mockReturnValue({
            photos: [{ id: 'first' }, { id: 'second' }],
            loading: false,
            error: null,
            hasMore: true,
            setPage: jest.fn()
        });
        (useFavouritePhotos as jest.Mock).mockReturnValue({
            favourites: ['1'],
            toggleFavourite: jest.fn()
        });

        render(<Home />);
        const photoCards = screen.getAllByTestId('photo-card');
        expect(photoCards).toHaveLength(2);
        expect(photoCards[0]).toHaveTextContent('first');
        expect(photoCards[1]).toHaveTextContent('second');
    });

    test('Should render loading indicator when loading is true', () => {
        (useInfinitePhotos as jest.Mock).mockReturnValue({
            photos: [],
            loading: true,
            error: null,
            hasMore: true,
            setPage: jest.fn()
        });
        (useFavouritePhotos as jest.Mock).mockReturnValue({
            favourites: [],
            toggleFavourite: jest.fn()
        });

        render(<Home />);
        expect(screen.getByText(/Loading more photos.../i)).toBeInTheDocument();
    });

    test('Should call setPage when the loader is intersecting', () => {
        const setPage = jest.fn();
        (useInfinitePhotos as jest.Mock).mockReturnValue({
            photos: [{ id: '1' }],
            loading: false,
            error: null,
            hasMore: true,
            setPage
        });
        (useFavouritePhotos as jest.Mock).mockReturnValue({
            favourites: [],
            toggleFavourite: jest.fn()
        });
        const { container } = render(<Home />);
        const loader = container.lastElementChild;
        expect(loader).toBeInTheDocument();
        expect(intersectionObserverInstance).not.toBeNull();
        intersectionObserverInstance!.trigger([
            {
                isIntersecting: true,
                target: loader!,
                time: 0,
                intersectionRatio: 1,
                boundingClientRect: {} as DOMRectReadOnly,
                intersectionRect: {} as DOMRectReadOnly,
                rootBounds: null
            }
        ]);
        expect(setPage).toHaveBeenCalled();
    });
});
