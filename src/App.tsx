import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useApi } from "./hooks";
import './App.css';
import { PhotoCard } from './components';
import { type Photo } from './types/api';

const App: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [favourites, setFavourites] = useState<number[]>(() => {
    const savedFavourites = localStorage.getItem("favourites");
    return savedFavourites ? JSON.parse(savedFavourites) : [];
  });

  const loaderRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const { fetchCuratedPhotos } = useApi({
    onError: (apiError: { status: number; message: string }) => {
      console.error(`Error (${apiError.status}): ${apiError.message}`);
      setError(apiError.message);
    },
  });

  const fetchPhotos = useCallback(async () => {
    if (!hasMore || loading) return;
    setLoading(true);

    try {
      const response = await fetchCuratedPhotos(15, page);
      if (response?.photos.length > 0) {
        setPhotos((prev) => {
          const newPhotos = response.photos.filter(
            (newPhoto) => !prev.some((photo) => photo.id === newPhoto.id)
          );
          return [...prev, ...newPhotos];
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

  useEffect(() => {
    if (!loaderRef.current || !hasMore || loading) return;

    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      {
        root: null,
        rootMargin: "100px",
        threshold: 1.0,
      }
    );

    observerRef.current.observe(loaderRef.current);

    return () => observerRef.current?.disconnect();
  }, [hasMore, loading]);

  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);

  const toggleFavourite = (photoId: number) => {
    setFavourites((prevFavourites) =>
      prevFavourites.includes(photoId)
        ? prevFavourites.filter((id) => id !== photoId)
        : [...prevFavourites, photoId]
    );
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className="gallery">
        {photos.map((photo) => (
          <PhotoCard
            photo={photo}
            isFavourite={favourites.includes(photo.id)}
            toggleFavourite={toggleFavourite}
          />
        ))}
      </div>
      {loading && <div>Loading more photos...</div>}
      <div ref={loaderRef} style={{ height: "20px", marginBottom: "50px" }}></div>
    </div>
  );
};

export default App;