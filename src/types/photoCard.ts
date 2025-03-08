import type { Photo } from './api';

export interface PhotoCardProps {
    photo: Photo;
    isFavourite: boolean;
    toggleFavourite: (id: number) => void;
};