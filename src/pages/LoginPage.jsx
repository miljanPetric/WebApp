import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const success = await login(username, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Pogrešno korisničko ime ili lozinka.');
    }
  };

  return (
    <div className="page-center"> { }
      <div className="form-card"> { }
        <h2 className="form-title">Prijava</h2> { }
        <form onSubmit={handleSubmit}>
          <div className="form-group"> { }
            <label className="form-label" htmlFor="username"> { }
              Korisničko Ime:
            </label>
            <input
              type="text"
              id="username"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group"> { }
            <label className="form-label" htmlFor="password"> { }
              Lozinka:
            </label>
            <input
              type="password"
              id="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-error">{error}</p>} { }
          <div className="form-actions"> { }
            <button
              type="submit"
              className="btn-primary"
            >
              Prijavi se
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;