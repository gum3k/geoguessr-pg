import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const UsernameDisplayComponent = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = getCookie('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log('Zdekodowany token:', decoded);
        setUsername(decoded.username);
      } catch (e) {
        console.error('Błąd dekodowania tokenu', e); 
      }
    } else {
      console.log('Token nie znaleziony w ciasteczkach');
    }
  }, []);

  return username || 'Guest';
};

export default UsernameDisplayComponent;
