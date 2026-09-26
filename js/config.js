// js/config.js

// Koyeb Backend API Base URL (Local မှာ စမ်းရင် localhost ညွှန်းနိုင်ပါသည်)
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:8000/public' 
    : 'https://some-aliens-smoke.loca.lt';

export default API_BASE_URL;