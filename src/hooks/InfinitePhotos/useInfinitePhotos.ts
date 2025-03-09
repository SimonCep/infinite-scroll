import { useState, useEffect, useCallback } from 'react';
import type { Photo } from '../../types/photo';
import { useApi } from '../';

export const useInfinitePhotos = (initialPage = 1, perPage = 15) => {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(initialPage);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const { fetchCuratedPhotos } = useApi({
        onError: (apiError: { status: number; message: string }) => {
            setError(apiError.message || 'An unexpected error occurred');
        },
    });

    const fetchPhotos = useCallback(async () => {
        if (!hasMore || loading) return;
        setLoading(true);

        try {
            const response = await fetchCuratedPhotos(perPage, page);
            if (response && Array.isArray(response.photos) && response.photos.length > 0) {
                setPhotos((prevPhotos) => {
                    const newPhotos = response.photos.filter(
                        (newPhoto) => !prevPhotos.some((photo) => photo.id === newPhoto.id)
                    );
                    return [...prevPhotos, ...newPhotos];
                });
            } else {
                setHasMore(false);
            }
        } finally {
            setLoading(false);
        }
    }, [page, hasMore, loading, fetchCuratedPhotos]);

    useEffect(() => {
        fetchPhotos();
    }, [page]);
    

    return { photos, loading, error, hasMore, setPage };
};
