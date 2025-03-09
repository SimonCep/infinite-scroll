import type { Photo } from './photo';

export interface PhotoCardProps {
    photo: Photo;
    isFavourite: boolean;
    toggleFavourite: (id: number) => void;
};