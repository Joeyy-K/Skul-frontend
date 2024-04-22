import React from 'react'

function logout() {
    const { setIsAuthenticated } = useContext(AuthContext);

    const handleLogout = () => {
      fetch('http://127.0.0.1:8000/schoolauth/user/logout/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', 
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        setIsAuthenticated(false);
        Cookies.set()
        Cookies.remove('isAuthenticated');
        Cookies.remove('csrftoken')
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    };
  
    return (
      <div>
        Home
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  };
  

export default logout