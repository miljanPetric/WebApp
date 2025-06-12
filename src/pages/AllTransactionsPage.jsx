import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllTransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const txResponse = await axios.get('http://localhost:5000/transactions?_sort=date&_order=desc');
        setTransactions(txResponse.data);

        const usersResponse = await axios.get('http://localhost:5000/users');
        setUsers(usersResponse.data);
      } catch (err) {
        setError('Greška pri učitavanju transakcija ili korisnika.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getUserNameById = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.username : 'Nepoznat';
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete ovu transakciju?')) {
      try {
        await axios.delete(`http://localhost:5000/transactions/${id}`);
        setTransactions(transactions.filter(tx => tx.id !== id));
      } catch (err) {
        setError('Greška pri brisanju transakcije.');
        console.error(err);
      }
    }
  };

  if (loading) {
    return <div className="text-center text-lg mt-8">Učitavanje svih transakcija...</div>;
  }

  return (
    <div className="page-wrapper"> { }
      <h1 className="page-title">Sve Transakcije</h1> { }
      <div className="card"> { }
        {error && <p className="text-error">{error}</p>} { }
        {transactions.length === 0 ? (
          <p className="text-muted">Nema transakcija u sistemu.</p>
        ) : (
          <table className="data-table"> { }
            <thead>
              <tr>
                <th className="table-header">ID</th> { }
                <th className="table-header">Pošiljalac</th> { }
                <th className="table-header">Primalac</th> { }
                <th className="table-header">Iznos</th> { }
                <th className="table-header">Valuta</th> { }
                <th className="table-header">Datum</th> { }
                <th className="table-header">Akcije</th> { }
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx.id} className="table-row"> { }
                  <td className="table-data table-id">{tx.id}</td> { }
                  <td className="table-data">{getUserNameById(tx.senderId)}</td> { }
                  <td className="table-data">{getUserNameById(tx.receiverId)}</td> { }
                  <td className="table-data">{tx.amount}</td> { }
                  <td className="table-data">{tx.currency}</td> { }
                  <td className="table-data table-date">{new Date(tx.date).toLocaleString()}</td> { }
                  <td className="table-data">
                    <button
                      onClick={() => handleDeleteTransaction(tx.id)}
                      className="btn-danger"
                    >
                      Obriši
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AllTransactionsPage;