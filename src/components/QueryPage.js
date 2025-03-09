import React, { useState, useEffect } from 'react';
import { MeiliSearch } from 'meilisearch';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const QueryPage = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTopMovies = async () => {
      setLoading(true);
      try {
        const client = new MeiliSearch({ host: 'http://127.0.0.1:7700' });
        const index = client.index('movies');

        // Retrieve up to 1000 documents then sort client-side.
        const searchResponse = await index.search('', { limit: 1000 });
        const movies = searchResponse.hits.filter(m => m["IMDb Rating"] !== undefined);

        // Sort movies descending by IMDb Rating (convert rating from string to number)
        movies.sort((a, b) => parseFloat(b["IMDb Rating"]) - parseFloat(a["IMDb Rating"]));

        // Get top 10 movies
        const top10 = movies.slice(0, 10);
        console.log('Top 10 Movies:', top10);

        // Create chart data: using movie titles as labels and IMDb Ratings as data
        const labels = top10.map(movie => movie.Title);
        const ratings = top10.map(movie => parseFloat(movie["IMDb Rating"]));

        setChartData({
          labels,
          datasets: [
            {
              label: 'IMDb Rating',
              data: ratings,
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching top movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopMovies();
  }, []);

  if (loading) return <div>Loading top movies...</div>;
  if (!chartData) return <div>No data available</div>;

  return (
    <div>
      <h2>Top 10 Movies by IMDb Rating</h2>
      <Bar data={chartData} options={{ responsive: true }} />
    </div>
  );
};

export default QueryPage;
