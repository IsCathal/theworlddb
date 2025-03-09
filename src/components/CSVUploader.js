import React, { useState } from 'react';
import Papa from 'papaparse';
import { MeiliSearch } from 'meilisearch';

const CsvUploader = () => {
  const [csvData, setCsvData] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');

  // Handle file input change and parse CSV data
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        console.log('Parsed CSV data:', results.data);
        setCsvData(results.data);
      },
      error: (err) => {
        console.error('Error parsing CSV:', err);
      },
    });
  };

  // Upload parsed CSV data to Meilisearch
  const handleUpload = async () => {
    // Create a Meilisearch client instance
    const client = new MeiliSearch({ host: 'http://127.0.0.1:7700' });
    const index = client.index('movies');

    // Transform CSV data to include a unique 'id' for each document
    const transformedData = csvData.map((doc, idx) => ({
      id: idx + 1,
      ...doc,
    }));

    console.log('Transformed Data:', transformedData);

    try {
      // Add documents to the index; this returns a task object
      const task = await index.addDocuments(transformedData);
      console.log('Add Documents Task:', task);
      setUploadStatus(`Documents are being indexed (task id: ${task.taskUid}).`);

      // Wait for the indexing task to complete using the task-based API
      await client.waitForTask(task.taskUid);
      setUploadStatus('Indexing complete!');
      console.log('Indexing complete!');

      // Example query after indexing
      const searchTerm = 'Action';
      const searchResponse = await index.search(searchTerm);
      console.log(`Search results for "${searchTerm}":`, searchResponse.hits);
    } catch (error) {
      console.error('Error uploading documents:', error);
      setUploadStatus('Error uploading documents.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>CSV Ingestion to Meilisearch</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      {csvData.length > 0 && (
        <div>
          <h3>Preview</h3>
          <pre style={{ maxHeight: '200px', overflow: 'auto' }}>
            {JSON.stringify(csvData, null, 2)}
          </pre>
          <button onClick={handleUpload}>Upload to Meilisearch</button>
        </div>
      )}
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
};

export default CsvUploader;
