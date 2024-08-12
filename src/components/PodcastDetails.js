import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function PodcastDetails({ onPlayEpisode }) {
  const { id } = useParams();
  const [podcast, setPodcast] = useState(null);
  const [error, setError] = useState(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [expandedSeason, setExpandedSeason] = useState(null);
  const [favoriteEpisodes, setFavoriteEpisodes] = useState([]);
  const [fullyListenedEpisodes, setFullyListenedEpisodes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPodcastDetails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://podcast-api.netlify.app/id/${id}`);
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText} (status code: ${response.status})`);
        }
        const data = await response.json();
        setPodcast(data);

        const storedFavorites = JSON.parse(localStorage.getItem(`favorites-${id}`)) || [];
        console.log('Fetched favorites:', storedFavorites);
        setFavoriteEpisodes(storedFavorites);

        const storedFullyListened = JSON.parse(localStorage.getItem(`fullyListened-${id}`)) || [];
        setFullyListenedEpisodes(storedFullyListened);
      } catch (error) {
        console.error('Error fetching podcast details:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPodcastDetails();
  }, [id]);

  const handleToggleFavoriteEpisode = (seasonIndex, episodeIndex) => {
    const existingFavorite = favoriteEpisodes.find(
      (fav) => fav.seasonIndex === seasonIndex && fav.episodeIndex === episodeIndex
    );
  
    let updatedFavorites;
    if (existingFavorite) {
      // If the episode is already a favorite, remove it
      updatedFavorites = favoriteEpisodes.filter(
        (fav) => !(fav.seasonIndex === seasonIndex && fav.episodeIndex === episodeIndex)
      );
    } else {

      const episode = {
        seasonIndex,
        episodeIndex,
        podcastTitle: podcast.title,
        podcastId: id,
        addedAt: new Date().toLocaleString(), 
      };
      updatedFavorites = [...favoriteEpisodes, episode];
    }
  
    setFavoriteEpisodes(updatedFavorites);
    localStorage.setItem(`favorites-${id}`, JSON.stringify(updatedFavorites));
    console.log('Updated favorites:', updatedFavorites);
  };
  

  const handleEpisodeEnd = (seasonIndex, episodeIndex) => {
    const episode = {
      seasonIndex,
      episodeIndex,
      podcastId: id,
    };

    if (!fullyListenedEpisodes.some(ep => ep.seasonIndex === seasonIndex && ep.episodeIndex === episodeIndex)) {
      const updatedFullyListened = [...fullyListenedEpisodes, episode];
      setFullyListenedEpisodes(updatedFullyListened);
      localStorage.setItem(`fullyListened-${id}`, JSON.stringify(updatedFullyListened));
    }
  };

  const handlePlayEpisode = (seasonIndex, episodeIndex) => {
    const episode = {
      seasonIndex,
      episodeIndex,
      podcastId: id,
      podcastTitle: podcast.title,
      title: `Season ${seasonIndex + 1} Episode ${episodeIndex + 1}`,
      audioSrc: "https://podcast-api.netlify.app/placeholder-audio.mp3",
    };

    onPlayEpisode(episode);

    const savedPosition = localStorage.getItem(`playback-${id}-${seasonIndex}-${episodeIndex}`);
    if (savedPosition) {
      episode.savedPosition = parseFloat(savedPosition);
    }

    setTimeout(() => handleEpisodeEnd(seasonIndex, episodeIndex), 3000); // Assume 3 seconds to mark as listened
  };

  const handleResetListenedHistory = () => {
    setFullyListenedEpisodes([]);
    localStorage.removeItem(`fullyListened-${id}`);
    podcast.seasons.forEach((season, seasonIndex) => {
      season.episodes.forEach((episode, episodeIndex) => {
        localStorage.removeItem(`playback-${id}-${seasonIndex}-${episodeIndex}`);
      });
    });
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
        {isLoading ? (
          <div className="text-orange-400 p-4">Loading...</div>
        ) : (
          <>
            <h1 className="text-2xl lg:text-4xl font-bold mb-4 text-orange-400">
              {podcast.title} ({podcast.seasons.length} Seasons)
            </h1>
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
            <button
              onClick={handleResetListenedHistory}
              className="mt-4 bg-orange-500 text-white p-2 rounded"
            >
              Reset Listened History
            </button>
            <div className="mt-8">
              {podcast.seasons.map((season, seasonIndex) => (
                <div key={seasonIndex} className="mb-6">
                  <h2
                    className="text-xl font-semibold cursor-pointer text-orange-400"
                    onClick={() => handleToggleSeason(seasonIndex)}
                  >
                    Season {seasonIndex + 1} ({season.episodes.length} Episodes)
                  </h2>
                  {expandedSeason === seasonIndex && (
                    <div>
                      <img src={season.image} alt={`Season ${seasonIndex + 1}`} className="w-full h-48 object-cover mt-4 mb-4" />
                      <ul className="mt-4 space-y-4">
                        {season.episodes.map((episode, episodeIndex) => {
                          const isFavorite = favoriteEpisodes.some(
                            (fav) => fav.seasonIndex === seasonIndex && fav.episodeIndex === episodeIndex
                          );
                          const isListened = fullyListenedEpisodes.some(
                            (ep) => ep.seasonIndex === seasonIndex && ep.episodeIndex === episodeIndex
                          );

                          return (
                            <li key={episodeIndex} className="bg-gray-900 p-4 rounded shadow">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="text-lg text-white">
                                    Episode {episodeIndex + 1}: {episode.title}
                                  </h3>
                                  <p className="text-sm text-gray-400">{formatDate(episode.date)}</p>
                                </div>
                                <div className="flex items-center">
                                  <button
                                    onClick={() => handleToggleFavoriteEpisode(seasonIndex, episodeIndex)}
                                    className={`ml-2 p-2 rounded ${isFavorite ? 'bg-yellow-500' : 'bg-orange-400'}`}
                                  >
                                    {isFavorite ? 'Unfavorite' : 'Favorite'}
                                  </button>
                                  <button
                                    onClick={() => handlePlayEpisode(seasonIndex, episodeIndex)}
                                    className="ml-4 p-2 bg-blue-500 text-white rounded"
                                  >
                                    Play
                                  </button>
                                  {isListened && (
                                    <span className="ml-2 text-orange-400">Listened</span>
                                  )}
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PodcastDetails;
