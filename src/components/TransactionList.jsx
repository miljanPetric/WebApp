import React from 'react';
import { Link } from 'react-router-dom';

const TransactionList = ({ transactions, userId }) => {
  if (!transactions || transactions.length === 0) {
    return <p className="text-muted">Nema transakcija.</p>;
  }

  return (
    <div className="transaction-list-card"> { }
      <h3 className="card-title">Istorija Transakcija</h3> { }
      <ul className="transaction-items-list"> { }
        {transactions.map(tx => {
          const isSender = tx.senderId === userId;
          const type = isSender ? 'Poslato' : 'Primljeno';
          const typeColor = isSender ? 'text-danger' : 'text-success';
          const counterParty = isSender ? tx.receiverId : tx.senderId;

          return (
            <li key={tx.id} className="transaction-item"> { }
              <div>
                <span className={`font-semibold ${typeColor}`}>{type}</span> {tx.amount} {tx.currency}
                <span className="text-sm text-muted block"> { }
                  {isSender ? `ka ${counterParty}` : `od ${counterParty}`} - {new Date(tx.date).toLocaleDateString()}
                </span>
              </div>
              <Link to={`/transactions/${tx.id}`} className="btn-link"> { }
                Detalji
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TransactionList;