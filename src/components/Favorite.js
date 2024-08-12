import React, { useState, useEffect, useCallback } from 'react';
import {  useNavigate } from 'react-router-dom';

function Favorite() {
  const [favoriteEpisodes, setFavoriteEpisodes] = useState([]);
  const [sortOption, setSortOption] = useState('title-asc');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  
  useEffect(() => {
    fetchFavorites();
  }, []); 

  const fetchFavorites = async () => {
    const storedFavorites = [];
    for (const key in localStorage) {
      if (key.startsWith('favorites-')) {
        const podcastId = key.split('-')[1];
        const favorites = JSON.parse(localStorage.getItem(key)) || [];

        const response = await fetch(`https://podcast-api.netlify.app/id/${podcastId}`);
        const data = await response.json();

        favorites.forEach((favorite) => {
          const season = data.seasons ? data.seasons[favorite.seasonIndex] : null;
          const episode = season ? season.episodes[favorite.episodeIndex] : null;

          if (episode) {
            storedFavorites.push({
              ...episode,
              podcastTitle: data.title,
              podcastId,
              seasonIndex: favorite.seasonIndex,
              episodeIndex: favorite.episodeIndex,
              addedAt: favorite.addedAt || new Date().toISOString(),
              updated: data.updated || episode.updated,
            });
          } else {
            console.error(`Episode not found for podcastId: ${podcastId}, seasonIndex: ${favorite.seasonIndex}, episodeIndex: ${favorite.episodeIndex}`);
          }
        });
      }
    }

    // Set state after all data has been processed
    setFavoriteEpisodes(storedFavorites);
    setLoading(false);
  };

  // Sort favorites based on selected option
  const sortFavorites = useCallback(() => {
    if (!favoriteEpisodes.length) return;

    const sortedFavorites = [...favoriteEpisodes];
    switch (sortOption) {
      case 'title-asc':
        sortedFavorites.sort((a, b) => a.podcastTitle.localeCompare(b.podcastTitle));
        break;
      case 'title-desc':
        sortedFavorites.sort((a, b) => b.podcastTitle.localeCompare(a.podcastTitle));
        break;
      case 'updated-recent':
        sortedFavorites.sort((a, b) => new Date(b.updated) - new Date(a.updated));
        break;
      case 'updated-oldest':
        sortedFavorites.sort((a, b) => new Date(a.updated) - new Date(b.updated));
        break;
      default:
        break;
    }

    setFavoriteEpisodes(sortedFavorites);
  }, [favoriteEpisodes, sortOption]);

  // Sort whenever sortOption or favoriteEpisodes changes
  useEffect(() => {
    sortFavorites();
  }, [sortOption, sortFavorites]);

  const removeFavorite = (podcastId, seasonIndex, episodeIndex) => {
    const key = `favorites-${podcastId}`;
    const storedFavorites = JSON.parse(localStorage.getItem(key)) || [];

    const updatedFavorites = storedFavorites.filter(
      (fav) => fav.seasonIndex !== seasonIndex || fav.episodeIndex !== episodeIndex
    );

    if (updatedFavorites.length > 0) {
      localStorage.setItem(key, JSON.stringify(updatedFavorites));
    } else {
      localStorage.removeItem(key);
    }

    fetchFavorites(); // Fetch the favorites again after removal
  };

  const handleGoToPodcast = (podcastId) => {
    setLoading(true);
    navigate(`/podcast/${podcastId}`);
  };

  return (
    <div className="bg-gray-800 min-h-screen">
      <div className="container mx-auto p-4 lg:p-8">
        <h1 className="text-2xl lg:text-4xl font-bold mb-4 text-orange-400">Favorite Episodes</h1>

        {loading ? (
          <div className="text-white">Loading...</div>
        ) : (
          <>
            <div className="mb-4 flex space-x-2">
              <button onClick={() => setSortOption('title-asc')} className="text-orange-400">Title A-Z</button>
              <button onClick={() => setSortOption('title-desc')} className="text-orange-400">Title Z-A</button>
              <button onClick={() => setSortOption('updated-recent')} className="text-orange-400">Most Recently Updated</button>
              <button onClick={() => setSortOption('updated-oldest')} className="text-orange-400">Oldest Updated</button>
            </div>

            <ul className="space-y-4">
              {favoriteEpisodes.length > 0 ? (
                favoriteEpisodes.map((favorite, index) => (
                  <li key={index} className="bg-gray-700 p-4 rounded shadow">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-lg text-orange-400">{favorite.podcastTitle}</h3>
                        <p className="text-white">
                          Season {favorite.seasonIndex + 1}, Episode {favorite.episodeIndex + 1}
                        </p>
                        <p className="text-gray-400 text-sm">
                          Added on: {favorite.addedAt ? new Date(favorite.addedAt).toLocaleDateString() : 'N/A'}
                        </p>
                        <p className="text-gray-400 text-sm">
                          Last Updated: {favorite.updated ? new Date(favorite.updated).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => handleGoToPodcast(favorite.podcastId)}
                          className="text-orange-400 hover:underline"
                        >
                          Go to Podcast
                        </button>
                        <button
                          onClick={() => removeFavorite(favorite.podcastId, favorite.seasonIndex, favorite.episodeIndex)}
                          className="text-orange-500 hover:text-orange-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <div className="text-white">No favorites found.</div>
              )}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default Favorite;
