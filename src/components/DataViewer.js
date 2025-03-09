import React, { useState, useEffect } from 'react';
import { MeiliSearch } from 'meilisearch';

const DataViewer = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const client = new MeiliSearch({ host: 'http://127.0.0.1:7700' });
    const index = client.index('movies'); // Ensure this matches your ingestion index name
    setLoading(true);
    
    // Using getDocuments to fetch all documents
    index.getDocuments({ limit: 1000 })
      .then(response => {
         // Depending on your version, the docs might be directly in response
         setDocuments(response.results || response);
         setLoading(false);
      })
      .catch(error => {
         console.error('Error fetching documents:', error);
         setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading data...</div>;
  
  return (
    <div style={{ padding: '20px' }}>
      <h2>Data Viewer</h2>
      {documents.length > 0 ? (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              {Object.keys(documents[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {documents.map((doc, idx) => (
              <tr key={idx}>
                {Object.values(doc).map((value, i) => (
                  <td key={i}>{JSON.stringify(value)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No documents found.</div>
      )}
    </div>
  );
};

export default DataViewer;
