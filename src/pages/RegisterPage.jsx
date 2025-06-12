import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Lozinke se ne podudaraju.');
      return;
    }

    if (password.length < 6) {
      setError('Lozinka mora imati najmanje 6 karaktera.');
      return;
    }

    const success = await register(username, password);
    if (success) {
      alert('Uspešna registracija! Sada se možete prijaviti.');
      navigate('/login');
    } else {
      setError('Registracija neuspešna. Korisničko ime možda već postoji.');
    }
  };

  return (
    <div className="page-center"> { }
      <div className="form-card"> { }
        <h2 className="form-title">Registracija</h2> { }
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
          <div className="form-group"> { }
            <label className="form-label" htmlFor="confirmPassword"> { }
              Potvrdi Lozinku:
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-error">{error}</p>} { }
          <div className="form-actions"> { }
            <button
              type="submit"
              className="btn-primary"
            >
              Registruj se
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;