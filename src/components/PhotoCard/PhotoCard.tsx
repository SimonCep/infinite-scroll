import type { FunctionComponent } from 'react';
import type { PhotoCardProps } from '../../types/photoCard';
import "./style.css";


const PhotoCard: FunctionComponent<PhotoCardProps> = ({
    photo,
    isFavourite,
    toggleFavourite}) => {
    return (
        <div key={photo.id} className="photoContainer">
            <img src={photo.src.original} alt={photo.alt || photo.photographer} className="photo" />
            <div className="overlay">
                {photo.alt && (
                    <>
                        <h2 className="title">{photo.alt}</h2>
                        <hr className="separator" />
                    </>
                )}
                <p className="photographer">{photo.photographer}</p>
                <button className="favouriteButton" onClick={() => toggleFavourite(photo.id)}>
                    {isFavourite ? "Unfavourite" : "Favourite"}
                </button>
            </div>
        </div>
    );
};

export default PhotoCard