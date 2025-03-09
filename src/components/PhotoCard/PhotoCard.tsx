import type { FunctionComponent } from 'react';
import type { PhotoCardProps } from '../../types/photoCard';
import "./style.css";


const PhotoCard: FunctionComponent<PhotoCardProps> = ({
    photo,
    isFavourite,
    toggleFavourite }) => {
    return (
        <div key={photo.id} className="photoContainer">
            <picture className="photoContainer">
                <source
                    media="(width >= 992px)"
                    srcSet={photo.src.large2x}
                />
                <source
                    media="(width >= 768px)"
                    srcSet={photo.src.large}
                />
                <img
                    src={photo.src.medium}
                    alt={photo.alt || photo.photographer}
                    loading="lazy"
                    className="photo"
                />
            </picture>
            <div className="overlay">
                {photo.alt && (
                    <>
                        <h1 className="title common-centered text-overflow">{photo.alt}</h1>
                        <hr className="separator common-centered" />
                    </>
                )}
                <p className="photographer common-centered text-overflow">{photo.photographer}</p>
                <button className="favouriteButton common-centered" onClick={() => toggleFavourite(photo.id)}>
                    {isFavourite ? "Unfavourite" : "Favourite"}
                </button>
            </div>
        </div>
    );
};

export default PhotoCard