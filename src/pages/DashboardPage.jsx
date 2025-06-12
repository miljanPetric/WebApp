import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import WalletOverview from '../components/WalletOverview';
import TransactionList from '../components/TransactionList';
import PortfolioChart from '../components/PortfolioChart';

const DashboardPage = () => {
    const { userId } = useAuth();
    const [wallet, setWallet] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [allCryptos, setAllCryptos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sendAmount, setSendAmount] = useState('');
    const [sendCurrency, setSendCurrency] = useState('BTC');
    const [receiverUsername, setReceiverUsername] = useState('');
    const [sendError, setSendError] = useState('');
    const [sendSuccess, setSendSuccess] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (!userId) {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const walletRes = await axios.get(`http://localhost:5000/wallets?userId=${userId}`);
                if (walletRes.data.length > 0) {
                    setWallet(walletRes.data[0]);
                } else {
                    const newWallet = { userId, balances: {} };
                    const createdWallet = await axios.post('http://localhost:5000/wallets', newWallet);
                    setWallet(createdWallet.data);
                }

                const txRes = await axios.get(`http://localhost:5000/transactions?senderId=${userId}`);
                const receivedTxRes = await axios.get(`http://localhost:5000/transactions?receiverId=${userId}`);

                const allUserTxs = [...txRes.data, ...receivedTxRes.data].sort((a, b) => new Date(b.date) - new Date(a.date));
                setTransactions(allUserTxs);

                const cryptoRes = await axios.get('http://localhost:5000/cryptos');
                setAllCryptos(cryptoRes.data);

                if (walletRes.data.length > 0 && Object.keys(walletRes.data[0].balances).length > 0) {
                    setSendCurrency(Object.keys(walletRes.data[0].balances)[0]);
                }

            } catch (error) {
                console.error("Greška pri učitavanju podataka:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    const handleSendCrypto = async (e) => {
        e.preventDefault();
        setSendError('');
        setSendSuccess('');

        const amount = parseFloat(sendAmount);
        if (isNaN(amount) || amount <= 0) {
            setSendError('Unesite validan iznos.');
            return;
        }

        if (!wallet || !wallet.balances[sendCurrency] || wallet.balances[sendCurrency] < amount) {
            setSendError(`Nedovoljno sredstava za ${sendCurrency}. Trenutno imate: ${wallet?.balances[sendCurrency] || 0} ${sendCurrency}`);
            return;
        }

        try {
            const senderUserRes = await axios.get(`http://localhost:5000/users/${userId}`);
            const senderUsername = senderUserRes.data.username;

            if (receiverUsername === senderUsername) {
                setSendError('Ne možete slati kriptovalute samom sebi.');
                return;
            }

            const receiverRes = await axios.get(`http://localhost:5000/users?username=${receiverUsername}`);
            if (receiverRes.data.length === 0) {
                setSendError('Primalac sa unetim korisničkim imenom ne postoji.');
                return;
            }
            const receiverUser = receiverRes.data[0];
            const receiverUserId = receiverUser.id;

            let receiverWalletRes = await axios.get(`http://localhost:5000/wallets?userId=${receiverUserId}`);
            let receiverWallet = receiverWalletRes.data[0];

            if (!receiverWallet) {
                receiverWallet = { userId: receiverUserId, balances: {} };
                receiverWallet = (await axios.post('http://localhost:5000/wallets', receiverWallet)).data;
            }

            const updatedSenderBalances = { ...wallet.balances };
            updatedSenderBalances[sendCurrency] -= amount;

            const updatedReceiverBalances = { ...receiverWallet.balances };
            updatedReceiverBalances[sendCurrency] = (updatedReceiverBalances[sendCurrency] || 0) + amount;

            await axios.patch(`http://localhost:5000/wallets/${wallet.id}`, { balances: updatedSenderBalances });

            await axios.patch(`http://localhost:5000/wallets/${receiverWallet.id}`, { balances: updatedReceiverBalances });

            const newTransaction = {
                id: `tx${Date.now()}`,
                senderId: userId,
                receiverId: receiverUserId,
                amount: amount,
                currency: sendCurrency,
                date: new Date().toISOString(),
                type: 'send'
            };
            await axios.post('http://localhost:5000/transactions', newTransaction);

            setSendSuccess('Kriptovaluta uspešno poslata!');
            setSendAmount('');
            setReceiverUsername('');

            setWallet(prevWallet => ({ ...prevWallet, balances: updatedSenderBalances }));

            const txRes = await axios.get(`http://localhost:5000/transactions?senderId=${userId}`);
            const receivedTxRes = await axios.get(`http://localhost:5000/transactions?receiverId=${userId}`);
            const allUserTxs = [...txRes.data, ...receivedTxRes.data].sort((a, b) => new Date(b.date) - new Date(a.date));
            setTransactions(allUserTxs);

        } catch (error) {
            console.error("Greška pri slanju kriptovalute:", error);
            setSendError('Došlo je do greške prilikom slanja. Proverite da li primalac postoji i imate li dovoljno sredstava.');
        }
    };

    if (loading) {
        return <div className="loading-message">Učitavanje...</div>;
    }

    if (!wallet || Object.keys(wallet.balances).length === 0) {
        return (
            <div className="page-container text-center">
                <h1 className="main-title">Moj Dashboard</h1>
                <p className="section-description">Vaš novčanik je trenutno prazan. Ne možete slati kriptovalute dok ne dobijete neku.</p>
            </div>
        );
    }


    return (
        <div className="page-container">
            <h1 className="main-title">Moj Dashboard</h1>

            <div className="dashboard-grid-1">
                {wallet && <WalletOverview wallet={wallet} allCryptos={allCryptos} />}
                {wallet && <PortfolioChart wallet={wallet} allCryptos={allCryptos} />}
            </div>

            <div className="dashboard-grid-2">
                <div className="card">
                    <h3 className="card-title">Pošalji Kriptovalutu</h3>
                    <form onSubmit={handleSendCrypto}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="receiverUsername">
                                Korisničko ime primaoca:
                            </label>
                            <input
                                type="text"
                                id="receiverUsername"
                                className="form-input"
                                value={receiverUsername}
                                onChange={(e) => setReceiverUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="sendAmount">
                                Iznos:
                            </label>
                            <input
                                type="number"
                                id="sendAmount"
                                className="form-input"
                                value={sendAmount}
                                onChange={(e) => setSendAmount(e.target.value)}
                                step="any"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="sendCurrency">
                                Kriptovaluta:
                            </label>
                            <select
                                id="sendCurrency"
                                className="form-select"
                                value={sendCurrency}
                                onChange={(e) => setSendCurrency(e.target.value)}
                            >
                                {Object.keys(wallet?.balances || {})
                                    .filter(symbol => wallet.balances[symbol] > 0)
                                    .map(symbol => (
                                        <option key={symbol} value={symbol}>{symbol}</option>
                                    ))}
                            </select>
                        </div>
                        {sendError && <p className="error-message">{sendError}</p>}
                        {sendSuccess && <p className="success-message">{sendSuccess}</p>}
                        <button
                            type="submit"
                            className="btn-primary"
                        >
                            Pošalji
                        </button>
                    </form>
                </div>

                <TransactionList transactions={transactions} userId={userId} />
            </div>
        </div>
    );
};

export default DashboardPage;