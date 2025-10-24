import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'secret123';

export default function Login({ setLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setLoggedIn(true);
      setUsername('');
      setPassword('');
      navigate('/admin');  // redirect to AdminPanel after login
    } else {
      alert('Invalid username or password');
    }
    setIsSubmitting(false);
  };

  return (
    <form className="add-product-form login-form" onSubmit={handleLogin}>
      <h2>Admin Login</h2>
      <input
        className="input-field"
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        autoComplete="username"
      />
      <input
        className="input-field"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="current-password"
      />
     <div
  style={{
    display: 'flex',
    justifyContent: 'center',
    marginTop: '8px',
  }}
>
  <button
    type="submit"
    disabled={isSubmitting}
    style={{
      padding: '12px 50px',
      fontSize: '16px',
      fontWeight: 'bold',
      backgroundColor: '#1b4332',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    }}
    onMouseOver={(e) => (e.target.style.backgroundColor = '#14532d')}
    onMouseOut={(e) => (e.target.style.backgroundColor = '#1b4332')}
  >
    {isSubmitting ? 'Logging in...' : 'Login'}
  </button>
</div>

  

    </form>
  );
}
