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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords are not the same!');
      return;
    }

    try {
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
        <div style={styles.formContainer}>
          <h2 style={styles.title}>Registration</h2>
          {error && <p style={{ ...styles.message, ...styles.error }}>{error}</p>}
          {successMessage && <p style={{ ...styles.message, ...styles.success }}>{successMessage}</p>}
          <form onSubmit={handleSubmit} style={styles.form}>
            <input type="text" name="login" placeholder="Login" value={formData.login} onChange={handleChange} required style={styles.input} />
            <input type="email" name="email" placeholder="E-mail" value={formData.email} onChange={handleChange} required style={styles.input} />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required style={styles.input} />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required style={styles.input} />
            <div style={styles.buttonContainer}>
              <BasicButtonComponent buttonText="Register" type="submit" />
            </div>
          </form>
        </div>
      </ContentComponent>
    </ContainerComponent>
  );
};

const styles = {
  form: {
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    width: '350px',
    maxWidth: '600px'
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#002244',
    color: '#ffffff',
    border: '1px solid #005599',
    borderRadius: '10px',
    fontFamily: 'Accuratist, sans-serif',
    outline: 'none',
  },
  message: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
  },
  success: {
    color: 'green',
  },
}

export default RegisterView;
