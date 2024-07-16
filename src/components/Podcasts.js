import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavBar from './NavBar';

function Podcasts() {
  const [podcasts, setPodcasts] = useState([]);
  const [filteredPodcasts, setFilteredPodcasts] = useState([]);
  const [error, setError] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const response = await fetch("https://podcast-api.netlify.app/shows");
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText} (status code: ${response.status})`);
        }
        const data = await response.json();
        // Sort podcasts alphabetically by title
        const sortedData = data.sort((a, b) => a.title.localeCompare(b.title));
        setPodcasts(sortedData);
        setFilteredPodcasts(sortedData);
      } catch (error) {
        console.error('Error fetching podcasts:', error);
        setError(error.message);
      }
    };

    fetchPodcasts();
  }, []);

  useEffect(() => {
    if (selectedGenre) {
      setFilteredPodcasts(podcasts.filter(podcast => podcast.genres.includes(selectedGenre)));
    } else {
      setFilteredPodcasts(podcasts);
    }
  }, [selectedGenre, podcasts]);

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  return (
    <div className="bg-gray-800 min-h-screen">
      <NavBar onSelectGenre={setSelectedGenre} />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-orange-400">Podcasts</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPodcasts.map((podcast) => (
            <div key={podcast.id} className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <Link to={`/podcast/${podcast.id}`}>
                <img src={podcast.image} alt={podcast.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-900">{podcast.title}</h2>
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
