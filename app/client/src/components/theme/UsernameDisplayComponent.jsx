import { useEffect, useState } from 'react';
import { getToken } from '../../utils/getToken';

const UsernameDisplayComponent = ({ onLoggedIn }) => {
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    try {
      const token = getToken();
      if (!token) {
        console.log('No token found – treating user as guest');
        setDisplayName('Guest');
        onLoggedIn(null);
      } else if (token.username) {
        setDisplayName(token.username);
        onLoggedIn(token);
      } else {
        console.warn('Token exists, but does not contain "username" field');
        setDisplayName('Undefined');
        onLoggedIn(null);
      }
    } catch (error) {
      console.error("An error occurred while trying to fetch token:", error);
      setDisplayName('Guest');
      onLoggedIn(null);
    }
  }, []);

  return displayName;
};

export default UsernameDisplayComponent;
