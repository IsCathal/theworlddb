import React, { useState } from 'react';
import CsvUploader from './components/CSVUploader';
import QueryPage from './/components/QueryPage';

const Home = () => {
  const [activeTab, setActiveTab] = useState('upload');

  return (
    <div>
      <h1>Meilisearch Movies Dashboard</h1>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setActiveTab('upload')}>Upload CSV</button>
        <button onClick={() => setActiveTab('query')}>Query Top 10 Movies</button>
      </div>
      <div>
        {activeTab === 'upload' && <CsvUploader />}
        {activeTab === 'query' && <QueryPage />}
      </div>
    </div>
  );
};

export default Home;
