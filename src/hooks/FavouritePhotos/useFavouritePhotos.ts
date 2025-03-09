import { useState, useEffect } from 'react';

export const useFavouritePhotos = (storageKey = "favourites") => {
    const [favourites, setFavourites] = useState<number[]>(() => {
        const savedFavourites = localStorage.getItem(storageKey);
        return savedFavourites ? JSON.parse(savedFavourites) : [];
    });

    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(favourites));
    }, [favourites]);

    const toggleFavourite = (photoId: number) => {
        setFavourites((prevFavourites) =>
            prevFavourites.includes(photoId)
                ? prevFavourites.filter((id) => id !== photoId)
                : [...prevFavourites, photoId]
        );
    };

    return { favourites, toggleFavourite };
};
