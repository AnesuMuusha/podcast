import React, { useRef, useEffect, useState } from 'react';

function GlobalAudioPlayer({ playingEpisode, onPlayPause, onTimeUpdate, onLoadedMetadata }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  useEffect(() => {
    if (playingEpisode && audioRef.current) {
      const playAudio = async () => {
        try {
          const savedPosition = localStorage.getItem(`playback-${playingEpisode.podcastId}-${playingEpisode.seasonIndex}-${playingEpisode.episodeIndex}`);
          if (savedPosition) {
            audioRef.current.currentTime = parseFloat(savedPosition);
          }

          audioRef.current.playbackRate = playbackSpeed;

          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.error('Error playing audio:', error);
        }
      };
      playAudio();
    } else {
      setIsPlaying(false);
    }
  }, [playingEpisode, playbackSpeed]);

  const handlePlayPause = async () => {
    if (audioRef.current.paused) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        onPlayPause(true);
      } catch (error) {
        console.error('Error playing audio:', error);
      }
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
      onPlayPause(false);
    }
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);

    if (playingEpisode) {
      localStorage.setItem(`playback-${playingEpisode.podcastId}-${playingEpisode.seasonIndex}-${playingEpisode.episodeIndex}`, audioRef.current.currentTime);
    }
  };

  const handleSpeedChange = (event) => {
    const newSpeed = parseFloat(event.target.value);
    setPlaybackSpeed(newSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    onPlayPause(false);
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-900 p-4 flex justify-between items-center">
      {playingEpisode ? (
        <>
          <div className="text-white">
            <h3>{playingEpisode.title}</h3>
            <p>{playingEpisode.podcastTitle}</p>
            <div>
              <progress value={currentTime} max={audioRef.current ? audioRef.current.duration : 0} />
              <span>{Math.floor(currentTime)} / {audioRef.current ? Math.floor(audioRef.current.duration) : 0} seconds</span>
            </div>
            <div>
              <label className="text-white mr-2">Speed:</label>
              <select value={playbackSpeed} onChange={handleSpeedChange} className="bg-orange-400 p-2 rounded-md">
                <option value={0.5}>0.5x</option>
                <option value={1}>1x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>
            </div>
          </div>
          <div>
            <button onClick={handlePlayPause} className="mr-4 p-2 bg-blue-500 text-white rounded">
              {isPlaying ? 'Stop' : 'Play'}
            </button>
            <audio
              ref={audioRef}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={onLoadedMetadata}
              onEnded={handleEnded}
              className="hidden"
              src={playingEpisode.audioSrc}
            />
          </div>
        </>
      ) : (
        <div className="text-white">No episode playing</div>
      )}
    </div>
  );
}

export default GlobalAudioPlayer;
