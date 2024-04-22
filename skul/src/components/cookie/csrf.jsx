import Cookies from "js-cookie";

export function fetchCSRFToken() {
  fetch(`http://127.0.0.1:8000/schoolauth/csrf/`, {
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
