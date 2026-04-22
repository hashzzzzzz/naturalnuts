const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://naturalnuts.onrender.com';

export const apiUrl = (path) => {
  const base = API_BASE_URL.replace(/\/+$/, '');
  const cleanPath = path.replace(/^\/+/, '');
  return `${base}/${cleanPath}`;
};
