import React, { useState, useEffect } from 'react';
import PasswordForm from './PasswordForm';

const PasswordCheck = ({ onAuthenticated }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handlePasswordSubmit = (password) => {
    fetch('https://datades.abundis.com.mx/dist/check_password.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setIsAuthenticated(true);
          onAuthenticated();
        } else {
          alert('Incorrect password');
        }
      });
  };

  if (!isAuthenticated) {
    return <PasswordForm onSubmit={handlePasswordSubmit} />;
  }

  return null; // Render nothing if authenticated
};

export default PasswordCheck;
