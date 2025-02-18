import { useState, useEffect } from 'react';

const useApiKey = () => {
  const [apiKey, setApiKey] = useState(null);

  useEffect(() => {
    fetch('/api/apikey')
      .then((res) => res.json())
      .then((data) => setApiKey(data.apiKey))
      .catch((err) => console.error('Error fetching API key:', err));
  }, []);

  return [apiKey];
};

export default useApiKey;
