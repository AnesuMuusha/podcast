import React from 'react';

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

  return (
    <div className="bg-gray-800 text-white p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
        <span onClick={() => onSelectGenre(null)} className="cursor-pointer hover:text-amazon-orange mb-2 sm:mb-0">Home</span>
        {genres.map((genre) => (
          <span key={genre.id} onClick={() => onSelectGenre(genre.id)} className="cursor-pointer hover:text-amazon-orange mb-2 sm:mb-0">
            {genre.name}
          </span>
        ))}
        <input
          type="text"
          placeholder="Search"
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full sm:w-auto sm:flex-1 text-black"
        />
      </div>
    </div>
  );
}

export default NavBar;
