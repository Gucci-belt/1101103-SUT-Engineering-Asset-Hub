// In production (Docker/VM), use relative path '/api' which Nginx proxies to backend
// In development, valid 'import.meta.env.PROD' check or fallback to localhost:3000
export const API_URL = import.meta.env.MODE === 'production'
    ? '/api'
    : `http://${window.location.hostname}:3000/api`;
