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

        const storedFullyListened = JSON.parse(localStorage.getItem(`fullyListened-${id}`)) || [];
        setFullyListenedEpisodes(storedFullyListened);
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

     setTimeout(() => handleEpisodeEnd(seasonIndex, episodeIndex), 3000); // Assume 3 seconds to mark as listened
  };

  const handleResetListenedHistory = () => {
    setFullyListenedEpisodes([]);
    localStorage.removeItem(`fullyListened-${id}`);
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
        <button
          onClick={handleResetListenedHistory}
          className="mt-4 p-2 bg-red-500 text-white rounded"
        >
          Reset Listened History
        </button>
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
                          onClick={() => handlePlayEpisode(seasonIndex, episodeIndex)}
                          className="ml-2 p-2 bg-blue-500 text-white rounded"
                        >
                          Play
                        </button>
                        <button
                          onClick={() => handleToggleFavoriteEpisode(seasonIndex, episodeIndex)}
                          className={`ml-2 p-2 ${favoriteEpisodes.some(fav => fav.seasonIndex === seasonIndex && fav.episodeIndex === episodeIndex) ? 'bg-red-500' : 'bg-orange-500'} text-white rounded`}
                        >
                          {favoriteEpisodes.some(fav => fav.seasonIndex === seasonIndex && fav.episodeIndex === episodeIndex) ? 'Unfavorite' : 'Favorite'}
                        </button>
                        {fullyListenedEpisodes.some(ep => ep.seasonIndex === seasonIndex && ep.episodeIndex === episodeIndex) && (
                          <span className="ml-2 text-green-500">Listened</span>
                        )}
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
