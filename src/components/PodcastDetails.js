import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

function PodcastDetails() {
  const { id } = useParams();
  const [podcast, setPodcast] = useState(null);
  const [error, setError] = useState(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [expandedSeason, setExpandedSeason] = useState(null);
  const [playingEpisode, setPlayingEpisode] = useState(null);
  const [favoriteEpisodes, setFavoriteEpisodes] = useState([]);
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

        const storedFavorites = JSON.parse(localStorage.getItem(`favorites-${id}`)) || [];
        setFavoriteEpisodes(storedFavorites);
      } catch (error) {
        console.error('Error fetching podcast details:', error);
        setError(error.message);
      }
    };

    fetchPodcastDetails();
  }, [id]);

  const handleToggleFavoriteEpisode = (seasonIndex, episodeIndex) => {
    const episode = {
      seasonIndex,
      episodeIndex,
      podcastTitle: podcast.title,
    };

    let updatedFavorites;
    if (favoriteEpisodes.some(fav => fav.seasonIndex === seasonIndex && fav.episodeIndex === episodeIndex)) {
      updatedFavorites = favoriteEpisodes.filter(
        fav => !(fav.seasonIndex === seasonIndex && fav.episodeIndex === episodeIndex)
      );
    } else {
      updatedFavorites = [...favoriteEpisodes, episode];
    }

    setFavoriteEpisodes(updatedFavorites);
    localStorage.setItem(`favorites-${id}`, JSON.stringify(updatedFavorites));
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

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
        <p className="mt-4 text-white text-sm lg:text-base">Last Updated: {formatDate(podcast.updated)}</p>
        <h2 className="text-xl lg:text-2xl font-semibold mt-4 text-orange-400">
          Seasons ({podcast.seasons.length})
        </h2>
        <ul>
          {podcast.seasons.map((season, seasonIndex) => (
            <li key={seasonIndex} className="mt-2">
              <h3
                className="text-lg lg:text-xl font-semibold text-white cursor-pointer"
                onClick={() => handleToggleSeason(seasonIndex)}
              >
                Season {seasonIndex + 1}
                <h1 className="text-gray-300 text-sm lg:text-base">Episodes: {season.episodes.length}</h1>
              </h3>
              {season.image && (
                <img src={season.image} alt={`Season ${seasonIndex + 1}`} className="w-1/4 h-32 lg:h-48 object-cover mt-2" />
              )}
              {expandedSeason === seasonIndex && (
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
                        <button
                          onClick={() => handleToggleFavoriteEpisode(seasonIndex, episodeIndex)}
                          className={`ml-2 p-2 ${favoriteEpisodes.some(fav => fav.seasonIndex === seasonIndex && fav.episodeIndex === episodeIndex) ? 'bg-red-500' : 'bg-orange-500'} text-white rounded`}
                        >
                          {favoriteEpisodes.some(fav => fav.seasonIndex === seasonIndex && fav.episodeIndex === episodeIndex) ? 'Unfavorite' : 'Favorite'}
                        </button>
                        <audio
                          ref={el => audioRefs.current[episodeIndex] = el}
                          onTimeUpdate={() => handleTimeUpdate(episodeIndex)}
                          onLoadedMetadata={() => handleLoadedMetadata(episodeIndex)}
                          controls
                          className="w-full mt-2"
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
