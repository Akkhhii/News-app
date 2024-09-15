// src/pages/api/search.js
import axios from 'axios';

export default async function handler(req, res) {
  const apiKey = process.env.GNEWS_API_KEY;
  const { query, page = 1 } = req.query; // Get the search query and page from the request

  const url = `https://gnews.io/api/v4/search?q=${query}&lang=en&max=10&page=${page}&apikey=${apiKey}`;

  try {
    const response = await axios.get(url);
    res.status(200).json(response.data); // Return the response data
  } catch (error) {
    res.status(500).json({ message: 'Error searching news', error: error.message });
  }
}
