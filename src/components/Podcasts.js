import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavBar from './NavBar';
import FeaturedPodcast from './FeaturedPodcast';

function Podcasts() {
  const [podcasts, setPodcasts] = useState([]);
  const [filteredPodcasts, setFilteredPodcasts] = useState([]);
  const [error, setError] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [sortOption, setSortOption] = useState('title-asc');

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const response = await fetch("https://podcast-api.netlify.app/shows");
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText} (status code: ${response.status})`);
        }
        const data = await response.json();
        setPodcasts(data);
        setFilteredPodcasts(data);
      } catch (error) {
        console.error('Error fetching podcasts:', error);
        setError(error.message);
      }
    };

    fetchPodcasts();
  }, []);

  useEffect(() => {
    let sortedPodcasts = [...podcasts];

    switch (sortOption) {
      case 'title-asc':
        sortedPodcasts.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-desc':
        sortedPodcasts.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'updated-recent':
        sortedPodcasts.sort((a, b) => new Date(b.updated) - new Date(a.updated));
        break;
      case 'updated-oldest':
        sortedPodcasts.sort((a, b) => new Date(a.updated) - new Date(b.updated));
        break;
      default:
        break;
    }

    if (selectedGenre) {
      setFilteredPodcasts(sortedPodcasts.filter(podcast => podcast.genres.includes(selectedGenre)));
    } else {
      setFilteredPodcasts(sortedPodcasts);
    }
  }, [sortOption, selectedGenre, podcasts]);

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  return (
    <div className="bg-gray-800 min-h-screen">
      <NavBar onSelectGenre={setSelectedGenre} />
      {podcasts.length > 0 && <FeaturedPodcast podcast={podcasts[0]} />}
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-orange-400">Podcasts</h1>
        <div className="mb-4">
          <label className="text-white mr-2">Sort by:</label>
          <select 
            value={sortOption} 
            onChange={(e) => setSortOption(e.target.value)} 
            className="p-2 rounded-md"
          >
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
            <option value="updated-recent">Most Recently Updated</option>
            <option value="updated-oldest">Least Recently Updated</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {filteredPodcasts.slice(1).map((podcast) => (
            <div key={podcast.id} className="bg-gray-700 shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <Link to={`/podcast/${podcast.id}`}>
                <img src={podcast.image} alt={podcast.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h2 className="text-lg  text-orange-400">{podcast.title}</h2>
                  <h2 className="text-xl  text-orange-400">{podcast.genres}</h2>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Podcasts;

