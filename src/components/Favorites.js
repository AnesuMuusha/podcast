import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [sortOption, setSortOption] = useState('mostRecent');

  useEffect(() => {
    const fetchFavorites = async () => {
      const favoriteIds = JSON.parse(localStorage.getItem('favorites')) || [];
      const favoritePodcasts = await Promise.all(favoriteIds.map(async (id) => {
        const response = await fetch(`https://podcast-api.netlify.app/id/${id}`);
        const data = await response.json();
        return { ...data, addedDate: new Date().toISOString() }; // Add the current date as addedDate
      }));
      setFavorites(favoritePodcasts);
    };

    fetchFavorites();
  }, []);

  const sortFavorites = (favorites, option) => {
    switch (option) {
      case 'titleAsc':
        return [...favorites].sort((a, b) => a.title.localeCompare(b.title));
      case 'titleDesc':
        return [...favorites].sort((a, b) => b.title.localeCompare(a.title));
      case 'mostRecent':
        return [...favorites].sort((a, b) => new Date(b.updated) - new Date(a.updated));
      case 'oldest':
        return [...favorites].sort((a, b) => new Date(a.updated) - new Date(b.updated));
      default:
        return favorites;
    }
  };

  const sortedFavorites = sortFavorites(favorites, sortOption);

  return (
    <div className="bg-gray-800 min-h-screen">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-orange-400">Favorite Podcasts</h1>
        <div className="mb-4">
          <label htmlFor="sort" className="text-white">Sort by: </label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="ml-2 p-2 rounded"
          >
            <option value="mostRecent">Most Recently Updated</option>
            <option value="oldest">Oldest Updated</option>
            <option value="titleAsc">Title A-Z</option>
            <option value="titleDesc">Title Z-A</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedFavorites.map((podcast) => (
            <div key={podcast.id} className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <Link to={`/podcast/${podcast.id}`}>
                <img src={podcast.image} alt={podcast.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-orange-400">{podcast.title}</h2>
                  <p className="text-gray-600">Last Updated: {new Date(podcast.updated).toLocaleDateString()}</p>
                  <p className="text-gray-600">Added: {new Date(podcast.addedDate).toLocaleDateString()}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Favorites;
