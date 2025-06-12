import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CryptoManagementPage = () => {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingCrypto, setEditingCrypto] = useState(null);
  const [newSymbol, setNewSymbol] = useState('');
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [addCryptoError, setAddCryptoError] = useState('');

  useEffect(() => {
    fetchCryptos();
  }, []);

  const fetchCryptos = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/cryptos');
      setCryptos(response.data);
    } catch (err) {
      setError('Greška pri učitavanju kriptovaluta.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCrypto = async (e) => {
    e.preventDefault();
    setAddCryptoError('');
    if (!newSymbol || !newName || !newPrice) {
      setAddCryptoError('Sva polja moraju biti popunjena.');
      return;
    }
    const price = parseFloat(newPrice);
    if (isNaN(price) || price <= 0) {
      setAddCryptoError('Unesite validnu cenu.');
      return;
    }

    try {
      const existingCrypto = await axios.get(`http://localhost:5000/cryptos?symbol=${newSymbol.toUpperCase()}`);
      if (existingCrypto.data.length > 0) {
        setAddCryptoError('Simbol već postoji.');
        return;
      }

      const newCrypto = {
        id: `crypto${Date.now()}`,
        symbol: newSymbol.toUpperCase(),
        name: newName,
        currentPriceUSD: price
      };
      await axios.post('http://localhost:5000/cryptos', newCrypto);
      fetchCryptos();
      setNewSymbol('');
      setNewName('');
      setNewPrice('');
    } catch (err) {
      setAddCryptoError('Greška pri dodavanju kriptovalute.');
      console.error(err);
    }
  };

  const handleEditCrypto = (crypto) => {
    setEditingCrypto(crypto);
    setNewSymbol(crypto.symbol);
    setNewName(crypto.name);
    setNewPrice(crypto.currentPriceUSD);
  };

  const handleUpdateCrypto = async (e) => {
    e.preventDefault();
    setAddCryptoError('');
    if (!newSymbol || !newName || !newPrice || !editingCrypto) {
      setAddCryptoError('Sva polja moraju biti popunjena za ažuriranje.');
      return;
    }
    const price = parseFloat(newPrice);
    if (isNaN(price) || price <= 0) {
      setAddCryptoError('Unesite validnu cenu.');
      return;
    }

    try {
      await axios.put(`http://localhost:5000/cryptos/${editingCrypto.id}`, {
        symbol: newSymbol.toUpperCase(),
        name: newName,
        currentPriceUSD: price
      });
      fetchCryptos();
      setEditingCrypto(null);
      setNewSymbol('');
      setNewName('');
      setNewPrice('');
    } catch (err) {
      setAddCryptoError('Greška pri ažuriranju kriptovalute.');
      console.error(err);
    }
  };

  const handleDeleteCrypto = async (id) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete ovu kriptovalutu?')) {
      try {
        await axios.delete(`http://localhost:5000/cryptos/${id}`);
        fetchCryptos();
      } catch (err) {
        setError('Greška pri brisanju kriptovalute.');
        console.error(err);
      }
    }
  };

  if (loading) {
    return <div className="loading-message">Učitavanje kriptovaluta...</div>;
  }

  return (
    <div className="page-wrapper">
      <h1 className="page-title">Upravljanje Kriptovalutama</h1>

      <div className="card form-section-card">
        <h2 className="card-title">{editingCrypto ? 'Ažuriraj Kriptovalutu' : 'Dodaj Novu Kriptovalutu'}</h2>
        <form onSubmit={editingCrypto ? handleUpdateCrypto : handleCreateCrypto}>
          <div className="form-group">
            <label className="form-label" htmlFor="symbol">
              Simbol (npr. BTC):
            </label>
            <input
              type="text"
              id="symbol"
              className="form-input"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value)}
              required
              disabled={!!editingCrypto}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Naziv (npr. Bitcoin):
            </label>
            <input
              type="text"
              id="name"
              className="form-input"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="price">
              Trenutna Cena (USD):
            </label>
            <input
              type="number"
              id="price"
              className="form-input"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              step="any"
              required
            />
          </div>
          {addCryptoError && <p className="error-message">{addCryptoError}</p>}
          <div className="form-actions">
            <button
              type="submit"
              className="btn-primary"
            >
              {editingCrypto ? 'Ažuriraj' : 'Dodaj Kriptovalutu'}
            </button>
            {editingCrypto && (
              <button
                type="button"
                onClick={() => { setEditingCrypto(null); setNewSymbol(''); setNewName(''); setNewPrice(''); }}
                className="btn-secondary spaced-left"
              >
                Poništi
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card table-section-card">
        <h2 className="card-title">Lista Kriptovaluta</h2>
        {error && <p className="error-message">{error}</p>}
        <table className="data-table">
          <thead>
            <tr>
              <th className="table-header">Simbol</th>
              <th className="table-header">Naziv</th>
              <th className="table-header">Cena (USD)</th>
              <th className="table-header">Akcije</th>
            </tr> 
          </thead>
          <tbody>
            {cryptos.map(crypto => (
              <tr key={crypto.symbol} className="table-row">
                <td className="table-data">{crypto.symbol}</td>
                <td className="table-data">{crypto.name}</td>
                <td className="table-data price-data">${crypto.currentPriceUSD.toFixed(2)}</td> {}
                <td className="table-data actions-data">
                  <button
                    onClick={() => handleEditCrypto(crypto)}
                    className="btn-info spaced-right"
                  >
                    Uredi
                  </button>
                  <button
                    onClick={() => handleDeleteCrypto(crypto.id)}
                    className="btn-danger"
                  >
                    Obriši
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CryptoManagementPage;