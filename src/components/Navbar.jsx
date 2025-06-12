import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { isAuthenticated, logout, userRole } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar"> { }
            <div className="container-fluid"> { }
                <Link to="/" className="navbar-brand">CryptoWallet</Link> { }
                <ul className="navbar-nav"> { }
                    {isAuthenticated ? (
                        <>
                            <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li> { }
                            {userRole === 'admin' && (
                                <li><Link to="/admin" className="nav-link">Admin Panel</Link></li>
                            )}
                            <li><button onClick={handleLogout} className="nav-button">Odjava</button></li> { }
                        </>
                    ) : (
                        <>
                            <li><Link to="/login" className="nav-link">Prijava</Link></li> { }
                            <li><Link to="/register" className="nav-link">Registracija</Link></li> { }
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;