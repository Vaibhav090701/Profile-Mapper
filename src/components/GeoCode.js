import { debounce } from 'lodash';

export const getCoordinatesFromAddress = async (address) => {
    const API_KEY = '3200b0a1ac3b4ab9bd02bbfc60ed96cb';
    const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${API_KEY}`);
    const data = await response.json();
    
    if (data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry;
      return { latitude: lat, longitude: lng };
    } else {
      throw new Error('No results found');
    }
    }
  

// Debounce the API call
export const debouncedGetCoordinatesFromAddress = debounce(async (address, callback) => {
  try {
    const { latitude, longitude } = await getCoordinatesFromAddress(address);
    callback({ latitude, longitude });
  } catch (error) {
    callback(null, error.message);
  }
}, 1000); // Debounce delay (1 second)
