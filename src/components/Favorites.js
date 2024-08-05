import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Favorites() {
  const [favoriteEpisodes, setFavoriteEpisodes] = useState([]);
  const [sortOption, setSortOption] = useState('mostRecent');

  useEffect(() => {
    const fetchFavorites = async () => {
      const allFavorites = [];
      for (let key in localStorage) {
        if (key.startsWith('favorites-')) {
          const podcastId = key.split('-')[1];
          const episodeIndexes = JSON.parse(localStorage.getItem(key)) || [];
          const response = await fetch(`https://podcast-api.netlify.app/id/${podcastId}`);
          const data = await response.json();

          episodeIndexes.forEach(index => {
            const season = data.seasons.find(season => season.episodes[index]);
            const episode = season ? season.episodes[index] : null;
            if (episode) {
              allFavorites.push({
                ...episode,
                podcastTitle: data.title,
                podcastId,
                seasonNumber: data.seasons.indexOf(season) + 1,
                episodeNumber: index + 1,
                addedDate: new Date().toISOString(),
                updated: episode.updated || data.updated,
                audioUrl: episode.audioUrl || 'https://podcast-api.netlify.app/placeholder-audio.mp3'
              });
            }
          });
        }
      }
      console.log("Fetched favorites:", allFavorites); // Debugging line
      setFavoriteEpisodes(allFavorites);
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

  const sortedFavorites = sortFavorites(favoriteEpisodes, sortOption);

  return (
    <div className="bg-gray-800 min-h-screen">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-orange-400">Favorite Episodes</h1>
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
        <div className="grid grid-cols-1 gap-4">
          {sortedFavorites.map((episode, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg p-4">
              <Link to={`/podcast/${episode.podcastId}`} className="block text-lg font-semibold text-orange-400">
                {episode.podcastTitle}
              </Link>
              <p className="text-gray-600">Season: {episode.seasonNumber}</p>
              <p className="text-gray-600">Episode: {episode.episodeNumber}</p>
              <audio controls className="w-full mt-2">
                <source src={episode.audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
              <p className="text-gray-600 mt-2">Last Updated: {episode.updated ? new Date(episode.updated).toLocaleDateString() : 'N/A'}</p>
              <p className="text-gray-600">Added: {new Date(episode.addedDate).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Favorites;
