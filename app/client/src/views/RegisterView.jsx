import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationComponent from '../components/theme/NavigationComponent';
import ContainerComponent from '../components/theme/ContainerComponent';
import ContentComponent from '../components/theme/ContentComponent';
import BasicButtonComponent from '../components/theme/BasicButtonComponent';

const RegisterView = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    login: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Sprawdzanie, czy hasła się zgadzają
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords are not the same!');
      return;
    }

    try {
      // Wysyłamy dane na backend
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.login,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Registration successful! You can now log in.');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setError('An error occurred. Please try again.');
    }
  };


  return (
    <ContainerComponent>
      <NavigationComponent />
      <ContentComponent>
        <div style={{ paddingTop: '100px', maxWidth: '400px', margin: '0 auto' }}>
          <h2 style={{ marginLeft: '5%' }}>Registration</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input type="text" name="login" placeholder="Login" value={formData.login} onChange={handleChange} required style={{ width: '100%', padding: '12px', fontSize: '16px', backgroundColor: '#333', color: '#fff', border: '1px solid #555' }} />
            <input type="email" name="email" placeholder="E-mail" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '12px', fontSize: '16px', backgroundColor: '#333', color: '#fff', border: '1px solid #555' }} />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required style={{ width: '100%', padding: '12px', fontSize: '16px', backgroundColor: '#333', color: '#fff', border: '1px solid #555' }} />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required style={{ width: '100%', padding: '12px', fontSize: '16px', backgroundColor: '#333', color: '#fff', border: '1px solid #555' }} />
            <div style={{marginLeft: '5%'}}>
            <BasicButtonComponent buttonText="Register" type="submit"/>
            </div>
          </form>
        </div>
      </ContentComponent>
    </ContainerComponent>
  );
};

export default RegisterView;
