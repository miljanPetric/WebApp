import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="homepage-wrapper"> { }
      <h1 className="homepage-title">Dobrodošli u CryptoWallet!</h1> { }
      <p className="homepage-description"> { }
        Vaše sigurno mesto za praćenje i upravljanje digitalnim valutama.
        Pratite svoje stanje, transakcije i budite u toku sa tržištem.
      </p>
      <div className="homepage-buttons"> { }
        <Link
          to="/register"
          className="btn-primary"
        >
          Registrujte se
        </Link>
        <Link
          to="/login"
          className="btn-secondary"
        >
          Prijavite se
        </Link>
      </div>
    </div>
  );
};

export default HomePage;