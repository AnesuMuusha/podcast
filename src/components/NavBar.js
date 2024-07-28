import React from 'react';
import { Link } from 'react-router-dom';

function NavBar({ onSelectGenre, setSearchQuery }) {
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
        <input
          type="text"
          placeholder="Search"
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full sm:w-auto sm:flex-1 text-black"
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
        <Link
          to="/"
          className="cursor-pointer hover:text-amazon-orange mb-2 sm:mb-0"
        >
          Home
        </Link>
        <Link
          to="/favorites"
          className="cursor-pointer hover:text-amazon-orange mb-2 sm:mb-0"
        >
          Favorites ⭐
        </Link>
      </div>
    </div>
  );
}

export default NavBar;
