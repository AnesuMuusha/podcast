import React, { useRef, useEffect, useState } from 'react';

function GlobalAudioPlayer({ playingEpisode, onPlayPause, onTimeUpdate, onLoadedMetadata }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (playingEpisode && audioRef.current) {
      const playAudio = async () => {
        try {
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
  }, [playingEpisode]);

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

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-900 p-4 flex justify-between items-center">
      {playingEpisode ? (
        <>
          <div className="text-white">
            <h3>{playingEpisode.title}</h3>
            <p>{playingEpisode.podcastTitle}</p>
          </div>
          <div>
            <button onClick={handlePlayPause} className="mr-4 p-2 bg-blue-500 text-white rounded">
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <audio
              ref={audioRef}
              onTimeUpdate={onTimeUpdate}
              onLoadedMetadata={onLoadedMetadata}
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
