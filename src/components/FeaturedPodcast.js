import React from 'react';
import { Link } from 'react-router-dom';

function FeaturedPodcast({ podcast }) {
  return (
    <div className="relative h-screen-3/4 bg-gray-800">
      <Link to={`/podcast/${podcast.id}`}>
        <img
          src={podcast.image}
          alt={podcast.title}
          className="lg:w-1/3 md:w-1/3 w-full h-full object-left-top opacity-80"
        />
        <div className="absolute bottom-0 left-0 p-4 bg-black bg-opacity-50 w-full text-white">
          <h2 className="text-3xl font-bold">{podcast.title}</h2>
          <p className="text-lg">{podcast.genres.join(', ')}</p>
        </div>
      </Link>
    </div>
  );
}

export default FeaturedPodcast;
