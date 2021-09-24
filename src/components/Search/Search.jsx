import React, { useState } from 'react';
import Wrapper, { Image, ImageWrapper, Input, Button, Form } from './Search.styles';

const Search = () => {
  const [searchValue, setSearchValue] = useState('');
  const [photos, setPhotos] = useState([]);
  const [history, setHistory] = useState(localStorage.getItem('searchHistory') ? JSON.parse(localStorage.getItem('searchHistory')) : []);
  const unsplashSearch = async (searchQuery) => {
    const apiKey = process.env.REACT_APP_API_KEY;
    const endpoint = `https://api.unsplash.com/search/photos?query=${searchQuery || searchValue}&per_page=30&page=1&client_id=${apiKey}`;
    try {
      const response = await fetch(endpoint);
      const json = await response.json();
      setPhotos(json?.results);
    } catch (e) {
      console.error(e);
    }
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    const newHistory = [...new Set([searchValue, ...history])].slice(0, 5);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    setHistory(newHistory);
    unsplashSearch(searchValue);
  }
  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  }
  return (
    <Wrapper>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          list="searchHistory"
          value={searchValue}
          onChange={handleSearch}
          placeholder="Unsplash search"
        />
        <datalist id="searchHistory" style={{ width: '100%' }}>
          {history.map((historyOption) => <option key={historyOption} >{historyOption}</option>)}
        </datalist>
        <Button type="submit">Search</Button>
      </Form>
      <ImageWrapper>
        {(photos || []).map((photo) => (
          <Image
            key={`${photo.id}-${Math.random()}`}
            src={photo?.urls?.thumb}
            alt={photo.alt_description}
          />
        ))}
      </ImageWrapper>
    </Wrapper>
  );
}

export default Search;