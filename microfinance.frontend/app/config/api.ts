export const API_BASE_URL = 'http://localhost:5176/api';

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${endpoint};
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      let errorMessage = 'An error occurred';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // Fallback to status text if JSON parsing fails
        errorMessage = response.statusText;
      }
      throw new Error(errorMessage);
    }
    
    // Check if the response is empty (e.g. 204 No Content)
    const text = await response.text();
    if (text) {
       return JSON.parse(text);
    }
    return null;
  } catch (error) {
    console.error(API Request failed for ${endpoint}:, error);
    throw error;
  }
};
