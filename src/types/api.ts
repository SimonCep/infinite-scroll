import type { Photo } from "./photo";
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface CuratedPhotosResponse {
    page: number;
    per_page: number;
    photos: Photo[];
    total_results: number;
    next_page?: string;
}