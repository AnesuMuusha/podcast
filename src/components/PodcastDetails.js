import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

function PodcastDetails() {
  const { id } = useParams();
  const [podcast, setPodcast] = useState(null);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [expandedSeason, setExpandedSeason] = useState(null);
  const [playingEpisode, setPlayingEpisode] = useState(null);
  const audioRefs = useRef([]);

  useEffect(() => {
    const fetchPodcastDetails = async () => {
      try {
        const response = await fetch(`https://podcast-api.netlify.app/id/${id}`);
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText} (status code: ${response.status})`);
        }
        const data = await response.json();
        setPodcast(data);

        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setIsFavorite(favorites.includes(data.id));
      } catch (error) {
        console.error('Error fetching podcast details:', error);
        setError(error.message);
      }
    };

    fetchPodcastDetails();
  }, [id]);

  const handleToggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (isFavorite) {
      const updatedFavorites = favorites.filter(favId => favId !== podcast.id);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setIsFavorite(false);
    } else {
      favorites.push(podcast.id);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      setIsFavorite(true);
    }
  };

  const truncateDescription = (description, wordLimit) => {
    const words = description.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return description;
  };

  const handleToggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  const handleToggleSeason = (index) => {
    setExpandedSeason(expandedSeason === index ? null : index);
  };

  const handlePlayPause = (episodeIndex) => {
    if (playingEpisode === episodeIndex) {
      audioRefs.current[episodeIndex].pause();
      setPlayingEpisode(null);
    } else {
      if (playingEpisode !== null) {
        audioRefs.current[playingEpisode].pause();
      }
      audioRefs.current[episodeIndex].play();
      setPlayingEpisode(episodeIndex);
    }
  };

  const handleTimeUpdate = (episodeIndex) => {
    const currentTime = audioRefs.current[episodeIndex].currentTime;
    localStorage.setItem(`podcast-${id}-episode-${episodeIndex}`, currentTime);
  };

  const handleLoadedMetadata = (episodeIndex) => {
    const savedTime = localStorage.getItem(`podcast-${id}-episode-${episodeIndex}`);
    if (savedTime) {
      audioRefs.current[episodeIndex].currentTime = savedTime;
    }
  };

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  if (!podcast) {
    return <div className="text-white p-4">Loading...</div>;
  }

  return (
    <div className="bg-gray-800 min-h-screen">
      <div className="container mx-auto p-4 lg:p-8">
        <h1 className="text-2xl lg:text-4xl font-bold mb-4 text-orange-400">{podcast.title}</h1>
        <img src={podcast.image} alt={podcast.title} className="w-full h-48 lg:h-96 object-cover" />
        <p className="mt-4 text-white text-sm lg:text-base">
          {isDescriptionExpanded
            ? podcast.description
            : truncateDescription(podcast.description, 15)}
          <span
            onClick={handleToggleDescription}
            className="text-blue-500 cursor-pointer ml-2"
          >
            {isDescriptionExpanded ? 'Show Less' : 'Show More'}
          </span>
        </p>
        <p className="mt-4 text-white text-sm lg:text-base">Last Updated: {podcast.updated.substring(0, 10)}</p>
        <button
          onClick={handleToggleFavorite}
          className={`mt-4 ${isFavorite ? 'bg-red-500' : 'bg-orange-500'} text-white p-2 rounded`}
        >
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </button>
        <h2 className="text-xl lg:text-2xl font-semibold mt-4 text-orange-400">Seasons</h2>
        <ul>
          {podcast.seasons.map((season, index) => (
            <li key={index} className="mt-2">
              <h3
                className="text-lg lg:text-xl font-semibold text-white cursor-pointer"
                onClick={() => handleToggleSeason(index)}
              >
                Season {index + 1}
                <h1 className="text-gray-300 text-sm lg:text-base">Episodes: {season.episodes.length}</h1>
              </h3>
              {expandedSeason === index && (
                <div>
                  <p className="text-gray-300 text-sm lg:text-base">{season.description}</p>
                  <ul className="ml-4">
                    {season.episodes.map((episode, episodeIndex) => (
                      <li key={episodeIndex} className="mb-4 text-gray-300 text-sm lg:text-base">
                        Episode {episodeIndex + 1}
                        <button
                          onClick={() => handlePlayPause(episodeIndex)}
                          className="ml-2 p-2 bg-blue-500 text-white rounded"
                        >
                          {playingEpisode === episodeIndex ? 'Pause' : 'Play'}
                        </button>
                        <audio
                          ref={el => audioRefs.current[episodeIndex] = el}
                          onTimeUpdate={() => handleTimeUpdate(episodeIndex)}
                          onLoadedMetadata={() => handleLoadedMetadata(episodeIndex)}
                          className="w-full mt-2 hidden"
                        >
                          <source src="https://podcast-api.netlify.app/placeholder-audio.mp3" type="audio/mpeg" />
                          Your browser does not support the audio element.
                        </audio>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PodcastDetails;
