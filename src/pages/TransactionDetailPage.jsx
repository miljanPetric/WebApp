import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const TransactionDetailPage = () => {
  const { id } = useParams();
  const { userId } = useAuth();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransaction = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(`http://localhost:5000/transactions/${id}`);
        const fetchedTx = response.data;

        if (fetchedTx.senderId === userId || fetchedTx.receiverId === userId) {
          setTransaction(fetchedTx);
        } else {
          setError("Nemate pristup ovoj transakciji.");
        }
      } catch (err) {
        console.error("Greška pri učitavanju transakcije:", err);
        setError("Transakcija nije pronađena ili je došlo do greške.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [id, userId]);

  if (loading) {
    return <div className="text-center text-lg mt-8">Učitavanje detalja transakcije...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 text-lg mt-8">{error}</div>;
  }

  if (!transaction) {
    return <div className="text-center text-lg mt-8">Transakcija nije pronađena.</div>;
  }

  const isSender = transaction.senderId === userId;
  const type = isSender ? 'Poslato' : 'Primljeno';
  const typeColor = isSender ? 'text-red-600' : 'text-green-600';

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl mx-auto mt-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Detalji Transakcije</h2>
      <div className="space-y-4 text-lg">
        <p><strong>ID Transakcije:</strong> {transaction.id}</p>
        <p><strong>Tip:</strong> <span className={typeColor}>{type}</span></p>
        <p><strong>Iznos:</strong> {transaction.amount} {transaction.currency}</p>
        <p><strong>Pošiljalac:</strong> {transaction.senderId}</p>
        <p><strong>Primalac:</strong> {transaction.receiverId}</p>
        <p><strong>Datum:</strong> {new Date(transaction.date).toLocaleString()}</p>
      </div>
      <div className="mt-8 text-center">
        <Link to="/dashboard" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300">
          Nazad na Dashboard
        </Link>
      </div>
    </div>
  );
};

export default TransactionDetailPage;