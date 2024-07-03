import React from 'react';

function NavBar({ onSelectGenre }) {
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
    <div>
      <span onClick={() => onSelectGenre(null)} style={{ cursor: 'pointer', marginRight: '10px' }}>Home</span> | 
      {genres.map((genre) => (
        <span key={genre.id} onClick={() => onSelectGenre(genre.id)} style={{ cursor: 'pointer', marginLeft: '10px' }}>
          {genre.name}
        </span>
      ))}
    </div>
  );
}

export default NavBar;
