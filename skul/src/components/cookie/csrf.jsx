import Cookies from 'js-cookie';

export function fetchCSRFToken() {
    fetch(`http://127.0.0.1:8000/schoolauth/csrf/`)
      .then(response => response.json())
      .then(data => {
        Cookies.set('csrftoken', data.csrftoken);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
}
