import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboardPage = () => {
  return (
    <div className="admin-page-wrapper"> { }
      <h1 className="admin-title">Admin Panel</h1> { }
      <div className="admin-grid"> { }
        <Link
          to="/admin/users"
          className="admin-card"
        >
          <span className="admin-icon">👥</span> { }
          <h2 className="admin-card-title">Upravljanje Korisnicima</h2> { }
          <p className="admin-card-description">Kreiranje, ažuriranje i brisanje korisničkih naloga.</p> { }
        </Link>
        <Link
          to="/admin/cryptos"
          className="admin-card"
        >
          <span className="admin-icon">₿</span> { }
          <h2 className="admin-card-title">Upravljanje Kriptovalutama</h2> { }
          <p className="admin-card-description">Dodavanje, uređivanje i brisanje podržanih kriptovaluta.</p> { }
        </Link>
        <Link
          to="/admin/transactions"
          className="admin-card"
        >
          <span className="admin-icon">💸</span> { }
          <h2 className="admin-card-title">Pregled Transakcija</h2> { }
          <p className="admin-card-description">Pregled svih transakcija u sistemu.</p> { }
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboardPage;