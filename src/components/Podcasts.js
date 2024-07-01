import React, { useState, useEffect } from 'react';

function Podcasts() {
  const [podcasts, setPodcasts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const response = await fetch("https://podcast-api.netlify.app/shows"); // Ensure the endpoint is correct
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText} (status code: ${response.status})`);
        }
        const data = await response.json();
        console.log(data);
        setPodcasts(data);
      } catch (error) {
        console.error('Error fetching podcasts:', error);
        setError(error.message);
      }
    };

    fetchPodcasts();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Podcasts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {podcasts.map((podcast) => (
          <div key={podcast.id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <img src={podcast.image} alt={podcast.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold">{podcast.title}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Podcasts;
