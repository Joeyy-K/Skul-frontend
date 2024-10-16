import Cookies from 'js-cookie';
import { API_URL } from '../url/url';

export const logout = async () => {
  try {
    const response = await fetch(`${API_URL}/schoolauth/user/logout/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken'),
      },
      credentials: 'include',
    });

    if (response.ok) {
      // Delay the deletion of cookies
      setTimeout(() => {
        // Get all cookies
        const allCookies = Cookies.get();

        // Loop over the cookies and remove each one
        for (let cookieName in allCookies) {
          Cookies.remove(cookieName);
        }
      }, 1000); // Delay of 1 second
    }

    return response;
  } catch (error) {
    console.error('Error during logout:', error);
    return null;
  }
};
