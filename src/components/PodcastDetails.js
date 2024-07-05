import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function PodcastDetails() {
  const { id } = useParams();
  const [podcast, setPodcast] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPodcastDetails = async () => {
      try {
        const response = await fetch(`https://podcast-api.netlify.app/id/${id}`);
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText} (status code: ${response.status})`);
        }
        const data = await response.json();
        setPodcast(data);
      } catch (error) {
        console.error('Error fetching podcast details:', error);
        setError(error.message);
      }
    };

    fetchPodcastDetails();
  }, [id]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!podcast) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{podcast.title}</h1>
      <img src={podcast.image} alt={podcast.title} className="w-full h-48 object-cover" />
      <p className="mt-4">{podcast.description}</p>
      <h2 className="text-xl font-semibold mt-4">Seasons</h2>
      <ul>
        {podcast.seasons.map((season, index) => (
          <li key={index} className="mt-2">
            <h3 className="text-lg font-semibold">Season {index + 1}</h3>
            <p>{season.description}</p>
            <p>Episodes: {season.episodes.length}</p>
            <ul className="ml-4">
              {season.episodes.map((episode, episodeIndex) => (
                <li key={episodeIndex} className="mb-4">
                  Episode {episodeIndex + 1}
                  <audio controls>
                    <source src="https://podcast-api.netlify.app/placeholder-audio.mp3" type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PodcastDetails;
