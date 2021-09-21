import React, { useState } from 'react';
import { Image } from './Search.styles';

const Search = () => {
  const [searchValue, setSearchValue] = useState('');
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  window.onscroll = () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500) {
        setPage(page + 1);
        unsplashSearch();
    }
};
  const unsplashSearch = async (searchQuery) => {
    const apiKey = process.env.REACT_APP_API_KEY;
    const endpoint = `https://api.unsplash.com/search/photos?query=${searchQuery || searchValue}&per_page=30&page=${page}&client_id=${apiKey}`;
    try {
      const response = await fetch(endpoint);
      const json = await response.json();
      setPhotos([...photos, ...json.results]);
      console.log(json.results);
    } catch (e) {
      console.error(e);
    }
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    unsplashSearch(searchValue);
  }
  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  }
  (photos || []).map(photo => console.log(photo.urls.thumb));
  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="headerSearch">
          <span>Search blog posts</span>
        </label>
        <input
          type="text"
          id="headerSearch"
          value={searchValue}
          onChange={handleSearch}
          placeholder="Search blog posts"
        />
        <button type="submit">Search</button>
      </form>
      <div className="imageContainer">
        {(photos || []).map((photo, index) => (
          <Image
            order={index + 1}
            key={`${photo.id}-${Math.random()}`}
            src={photo.urls.thumb}
            alt={photo.alt_description}
          />
        ))}
      </div>
    </>
  );
}

export default Search;