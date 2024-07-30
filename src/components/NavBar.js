import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function NavBar({ onSelectGenre, setSearchQuery }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const genres = [
    { id: 1, name: 'Personal Growth' },
    { id: 2, name: 'Investigative Journalism' },
    { id: 3, name: 'History' },
    { id: 4, name: 'Comedy' },
    { id: 5, name: 'Entertainment' },
    { id: 6, name: 'Business' },
    { id: 7, name: 'Fiction' },
    { id: 8, name: 'News' },
    { id: 9, name: 'Kids and Family' },
  ];

  const handleGenreChange = (event) => {
    onSelectGenre(parseInt(event.target.value, 10));
  };

  return (
    <div className="bg-gray-800 text-white p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full sm:w-auto text-black"
          />
          <select
            onChange={handleGenreChange}
            className="border border-gray-300 rounded-md p-2 text-black w-full sm:w-auto"
          >
            <option value="">Select Genre</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="sm:hidden focus:outline-none mt-2 sm:mt-0"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}
            ></path>
          </svg>
        </button>
        <div className="hidden sm:flex space-x-4 mt-2 sm:mt-0">
          <Link to="/" className="hover:text-orange-500">
            Home
          </Link>
          <Link to="/favorites" className="hover:text-orange-500">
            Favorites ⭐
          </Link>
        </div>
      </div>
      {isMenuOpen && (
        <div className="flex flex-col mt-4 sm:hidden">
          <Link to="/" className="hover:text-orange-500 mb-2">
            Home
          </Link>
          <Link to="/favorites" className="hover:text-orange-500 mb-2">
            Favorites ⭐
          </Link>
        </div>
      )}
    </div>
  );
}

export default NavBar;
