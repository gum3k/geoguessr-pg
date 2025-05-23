import { jwtDecode } from 'jwt-decode';

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

export const getToken = () => {
  const token = getCookie('token');
  if (token) {
    try {
      const decoded = jwtDecode(token);
      console.log('Zdekodowany token:', decoded);
      return decoded;
    } catch (e) {
      console.error('Błąd dekodowania tokenu', e); 
      return null;
    }
  } else {
    console.log('Token nie znaleziony w ciasteczkach');
    return null;
  }
};

export const getUserIdFromToken = () => {
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];

  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.id || null;
  } catch (e) {
    console.error("Token decode error:", e);
    return null;
  }
};