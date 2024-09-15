'use client'

import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import Navbar from '@/app/components/Navbar';


export default function SearchPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const observer = useRef();

  const fetchNews = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get('/api/search', { params: { query, page } });
      setNews((prevNews) => [...prevNews, ...response.data.articles]);
      setHasMore(response.data.articles.length > 0);
      setLoading(false);
    } catch (error) {
      console.error('Error searching news:', error);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset page to 1 for new search
    setNews([]); // Clear the news list for new search
    fetchNews(1); // Fetch the first page of results
  };

  useEffect(() => {
    if (page > 1) fetchNews(page);
  }, [page]);

  const lastNewsElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <>
      <Navbar />
      <div className='bg-red-400 px-6 md:px-[6em] lg:px-[22em] flex flex-col items-start gap-4 '>
        <h1 className='font-semibold text-2xl'>Search News Here</h1>
        <form onSubmit={(e) => { setQuery(e.target.search.value); handleSearch(e); }} className='bg-red-400'>
          <input type="text" name="search" placeholder="Search news..." />
          <button type="submit">Search</button>
        </form>

        <ul className='bg-rd-400 flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3'>
          {news.map((article, index) => (
            <li key={index} ref={index === news.length - 1 ? lastNewsElementRef : null} className='bg-stone-800  gap-[2em] rounded-lg p-2 flex flex-col text-start'>
              <h3 className='text-stone-300 font-semibold'>{article.title}</h3>
              <p>{article.description}</p>
              <a href={article.url} target="_blank" rel="noopener noreferrer" className='text-blue-400'>
                Read More
              </a>
            </li>
          ))}
        </ul>
        {loading && <p>Loading more news...</p>}
      </div>
    </>
  );
}
