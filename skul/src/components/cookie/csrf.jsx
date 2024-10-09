import Cookies from "js-cookie";
import { API_URL } from "../url/url";

export function fetchCSRFToken() {
  fetch(`${API_URL}/schoolauth/csrf/`, {
    credentials: 'include',
  })
  .then(response => response.json())
  .then(data => {
    let csrftoken = data.csrftoken;

    Cookies.set('csrftoken', csrftoken);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}
