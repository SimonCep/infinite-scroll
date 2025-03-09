Photo Showcase App
A Photo Showcase App built with React, TypeScript, and Vite. This app displays photos in a responsive grid view with three columns and includes features such as infinite scroll, lazy-loading images, responsive image handling, and the ability to favorite photos (persisted across page reloads). The app is fully tested with Jest.

Features
Responsive Design: Adapts to five breakpoints:

Phones (up to 600px)

Large phones and small tablets (up to 768px)

Tablets (768px - 992px)

Desktops (992px - 1200px)

Full-screen desktops (1200px and above)

Infinite Scroll: Automatically loads more photos as the user scrolls down.

Lazy-loading Images: Images are loaded only when they are about to appear in the viewport, improving performance.

Responsive Image Solution: Loads higher-quality images only when needed based on screen size and resolution.

Favorites: Users can mark photos as favorites. Favorites persist across page reloads using local storage.

Unit Tests: Comprehensive Jest tests ensure the app's functionality.

Getting Started
Follow these instructions to set up and run the project locally.

Prerequisites
Ensure you have the following installed on your system:

Node.js (v16 or later recommended)

npm or yarn

Installation
Clone the repository:

bash
git clone https://github.com/your-username/photo-showcase-app.git
cd photo-showcase-app
Install dependencies:

Using npm:

bash
npm install
Or using yarn:

bash
yarn install
Running the App
Start the development server:

Using npm:

bash
npm run dev
Or using yarn:

bash
yarn dev
Open your browser and navigate to http://localhost:5173 (or the URL provided in your terminal).

Building for Production
To create an optimized production build:

Using npm:

bash
npm run build
Or using yarn:

bash
yarn build
The production-ready files will be located in the dist folder.

Running Tests
To run all Jest tests:

Using npm:

bash
npm run test
Or using yarn:

bash
yarn test
You can also run tests in watch mode for development:

Using npm:

bash
npm run test:watch
Or using yarn:

bash
yarn test:watch
Folder Structure
text
photo-showcase-app/
├── src/
│   ├── components/      # Reusable React components (e.g., PhotoGrid, PhotoCard)
│   ├── hooks/           # Custom React hooks (e.g., useInfiniteScroll, useFavorites)
│   ├── utils/           # Utility functions (e.g., responsive image logic)
│   ├── pages/           # Page-level components (e.g., HomePage)
│   ├── styles/          # CSS or SCSS files for styling
│   ├── assets/          # Static assets like images or icons
│   ├── tests/           # Jest test files for components and utilities
│   └── main.tsx         # Entry point of the application
├── public/              # Static files served as-is by Vite
├── package.json         # Project dependencies and scripts
├── tsconfig.json        # TypeScript configuration file
├── vite.config.ts       # Vite configuration file
└── README.md            # Project documentation (this file)
Key Features Implementation
Responsive Design
The app uses CSS media queries to handle five breakpoints for different devices. Example:

css
/* styles/grid.css */
.photo-grid {
  display: grid;
  gap: 16px;
}

@media (max-width: 600px) {
  .photo-grid {
    grid-template-columns: repeat(1, 1fr);
  }
}

@media (min-width: 601px) and (max-width: 768px) {
  .photo-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 769px) {
  .photo-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
Infinite Scroll
Implemented with a custom hook (useInfiniteScroll) that listens for scroll events and fetches additional data when nearing the bottom of the page.

Lazy-loading Images
Images are lazy-loaded using the loading="lazy" attribute in HTML <img> tags.

tsx
<img src={imageUrl} alt="Photo" loading="lazy" />
Favorites Persistence
Favorites are stored in local storage to persist across page reloads. Example:

tsx
const [favorites, setFavorites] = useState<string[]>(() => {
  const saved = localStorage.getItem('favorites');
  return saved ? JSON.parse(saved) : [];
});

const toggleFavorite = (id: string) => {
  const updatedFavorites = favorites.includes(id)
    ? favorites.filter((fav) => fav !== id)
    : [...favorites, id];
  
  setFavorites(updatedFavorites);
  localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
};
Future Enhancements
Add user authentication for personalized favorites.

Implement server-side rendering (SSR) for better SEO.

Add dark mode toggle for improved user experience.

Integrate a backend API for dynamic photo fetching.

License
This project is licensed under the MIT License. Feel free to use it as you see fit!
