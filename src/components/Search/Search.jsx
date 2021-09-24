import React, { useState, useEffect } from 'react';
import Wrapper, { Image, ImageWrapper, Input, Button, Form } from './Search.styles';

const Search = () => {
  const [searchValue, setSearchValue] = useState('');
  const [photos, setPhotos] = useState([]);
  const [isAuth, setIsAuth] = useState(sessionStorage.getItem('access_token') ? true : false);
  const [history, setHistory] = useState(localStorage.getItem('searchHistory') ? JSON.parse(localStorage.getItem('searchHistory')) : []);

  useEffect(() => {
    const authCode = new URLSearchParams(window?.location?.search).get('code');
    if (authCode) {
      let url = 'https://unsplash.com/oauth/token';
      url += `?code=${authCode}`;
      const clientId = process.env.REACT_APP_API_KEY;
      url += `&client_id=${clientId}`;
      const clientSecret = process.env.REACT_APP_SECRET_KEY;
      url += `&client_secret=${clientSecret}`;
      const redirectUri = 'http://localhost:3001';
      url += `&redirect_uri=${redirectUri}`;
      const grantType = 'authorization_code';
      url += `&grant_type=${grantType}`;

      fetch(url, {
        method: 'POST',
      })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        sessionStorage.setItem('access_token', data.access_token);
        setIsAuth(true);
        window.location.href = window.location.origin + window.location.pathname;
      });
    }
  }, []);
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
  const handleLogin = () => {
    const apiKey = process.env.REACT_APP_API_KEY
    const permissions = 'public+read_user+write_user+read_photos+write_photos+write_likes+write_followers+read_collections+write_collections';
    const url = `https://unsplash.com/oauth/authorize?client_id=${apiKey}&redirect_uri=http://localhost:3001/&response_type=code&scope=${permissions}`;
    window.open(url, '_blank').focus();
  }
  const handleLogout = () => {
    sessionStorage.removeItem('access_token');
    setIsAuth(false);
  }
  const handleVote = async (id, method) => {
    const token = isAuth && sessionStorage.getItem('access_token');
    const endpoint = `https://api.unsplash.com/photos/${id}/like`;
    try {
      const result = await fetch(endpoint, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Dont know why api doesnt works as expected, so this just for visual result
      const data = await result.json();
      const photoIndex = photos.map(({ id }) => id ).indexOf(data.photo.id);
      const updatedPhotos = photos;
      updatedPhotos.splice(photoIndex, 1, data.photo)
      setPhotos([...updatedPhotos]);
    } catch (e) {
      console.error(e);
    }
  }
  return (
    <>
      <div style={{ padding: 20, display: 'flex', justifyContent: 'flex-end' }}>
        { isAuth ? <Button onClick={handleLogout}>Log out</Button> : <Button onClick={handleLogin}>Log in</Button>}
      </div>
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
            <div key={`${photo?.id}-${Math.random()}`} style={{ marginBottom: 16 }}>
              <Image
                src={photo?.urls?.thumb}
                alt={photo?.alt_description}
              />
              { isAuth && photo?.liked_by_user
                ? <Button vote="unlike" onClick={() => handleVote(photo?.id, 'DELETE')}>Unlike</Button>
                : <Button vote="like" onClick={() => handleVote(photo?.id, 'POST')}>Like</Button>}
            </div>
          ))}
        </ImageWrapper>
      </Wrapper>
    </>
  );
}

export default Search;