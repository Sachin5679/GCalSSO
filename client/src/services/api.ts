import axios from 'axios';

export const fetchEvents = async () => {
  try {
    const response = await axios.get(`https://g-cal-sso-backend.vercel.app/events`, {
      withCredentials: true,
    });
    return response.data;
  } catch (err: any) {
    console.error('Error fetching events:', err);
    if (err.response && err.response.status === 401) {
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        const retryResponse = await axios.get(`https://g-cal-sso-backend.vercel.app/events`, {
          withCredentials: true,
        });
        return retryResponse.data;
      }
    }
    throw err; 
  }
};

export const refreshAccessToken = async () => {
  try {
    const response = await axios.post('https://g-cal-sso-backend.vercel.app/refresh-token', {}, { withCredentials: true });
    return response.data.accessToken;
  } catch (err) {
    console.error('Error refreshing access token:', err);
    throw err;
  }
};

export const logout = async () => {
  try {
    await axios.post('https://g-cal-sso-backend.vercel.app/logout', {}, { withCredentials: true });
  } catch (err) {
    console.error('Error during logout:', err);
    throw err;
  }
};