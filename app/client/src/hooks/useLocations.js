import { useState } from 'react';

const useLocations = () => {
  const [locations, setLocations] = useState([]);

  return [locations, setLocations];
};

export default useLocations;
