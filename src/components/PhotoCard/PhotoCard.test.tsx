import { render, screen, fireEvent } from "@testing-library/react";
import PhotoCard from "./PhotoCard";
import type { PhotoCardProps } from "../../types/photoCard";

describe("PhotoCard Component tests", () => {
    const mockPhoto: PhotoCardProps["photo"] = {
        id: 123,
        width: 10,
        height: 10,
        url: 'url',
        photographer: 'person',
        photographer_url: 'person url',
        photographer_id: 1,
        avg_color: 'red',
        src: {
            original: "original.jpg",
            large2x: "large2x.jpg",
            large: "large.jpg",
            medium: "medium.jpg",
            small: "small.jpg",
            portrait: "prtrait.jpg",
            landscape: "landscape.jpg",
            tiny: "tiny.jpg",
        },
        liked: false,
        alt: "alt text"
    };

    const mockToggleFavourite = jest.fn();

    it("Should render correctly with all elements", () => {
        render(<PhotoCard photo={mockPhoto} isFavourite={false} toggleFavourite={mockToggleFavourite} />);
        const imgElement = screen.getByRole("img", { name: /alt text/i });
        expect(imgElement).toBeInTheDocument();
        expect(imgElement).toHaveAttribute("src", "medium.jpg");
        expect(screen.getByText("person")).toBeInTheDocument();
        const favouriteButton = screen.getByRole("button", { name: /favourite/i });
        expect(favouriteButton).toBeInTheDocument();
    });

    it("Should display 'Unfavourite' when isFavourite is true", () => {
        render(<PhotoCard photo={mockPhoto} isFavourite={true} toggleFavourite={mockToggleFavourite} />);
        const unfavouriteButton = screen.getByRole("button", { name: /unfavourite/i })
        expect(unfavouriteButton).toBeInTheDocument();
    });

    it("Should call toggleFavourite function when button is clicked", () => {
        render(<PhotoCard photo={mockPhoto} isFavourite={false} toggleFavourite={mockToggleFavourite} />);

        const favouriteButton = screen.getByRole("button", { name: /favourite/i });
        fireEvent.click(favouriteButton);

        expect(mockToggleFavourite).toHaveBeenCalledTimes(1);
        expect(mockToggleFavourite).toHaveBeenCalledWith(123);
    });
});
