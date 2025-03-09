import { useEffect, useRef } from 'react';
import './style.css';
import { PhotoCard } from "../../components"
import { useFavouritePhotos, useInfinitePhotos } from '../../hooks';

const Home = () => {
    const loaderRef = useRef<HTMLDivElement | null>(null);

    const { photos, loading, error, hasMore, setPage } = useInfinitePhotos();
    const { favourites, toggleFavourite } = useFavouritePhotos();

    useEffect(() => {
        if (!loaderRef.current || !hasMore || loading) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting && hasMore && !loading) {
                    setPage(prevPage => prevPage + 1);
                }
            },
            {
                root: null,
                rootMargin: '100px',
                threshold: 1
            }
        );

        observer.observe(loaderRef.current);

        return () => observer.disconnect();
    }, [hasMore, loading, setPage]);

    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <div className="gallery">
                {photos.map((photo) => (
                    <PhotoCard
                        key={photo.id}
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

export default Home;
