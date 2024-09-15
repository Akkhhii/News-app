'use client'

import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function HeadlinesPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/headlines', { params: { page } });
        setNews((prevNews) => [...prevNews, ...response.data.articles]);
        setHasMore(response.data.articles.length > 0);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching headlines:', error);
        setLoading(false);
      }
    };

    fetchNews();
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

      <div className='bg-re-400 px-6 md:px-[6em] lg:px-[22em] flex flex-col items-start gap-4 '>
        <div className='w-full h-20 flex mt-4 justify-between items-center'>
          <h1 className='font-semibold text-2xl'>Top Headlines</h1>
          <ul className='pr-2'>
            <li><Link href="/searchpage">Click to Search News</Link></li>
          </ul>
        </div>
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
