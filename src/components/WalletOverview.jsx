import React, { useEffect, useState } from 'react';
import axios from 'axios';

const simulatePriceChange = (originalPrice) => {
    const changePercentage = (Math.random() - 0.5) * 0.05;
    return originalPrice * (1 + changePercentage);
};

const WalletOverview = ({ wallet, allCryptos }) => {
    const [cryptoPrices, setCryptoPrices] = useState({});

    useEffect(() => {

        const initialPrices = {};
        allCryptos.forEach(crypto => {
            initialPrices[crypto.symbol] = crypto.currentPriceUSD;
        });
        setCryptoPrices(initialPrices);

        const interval = setInterval(() => {
            setCryptoPrices(prevPrices => {
                const newPrices = { ...prevPrices };
                allCryptos.forEach(crypto => {

                    const originalCrypto = allCryptos.find(c => c.symbol === crypto.symbol);
                    if (originalCrypto) {
                        newPrices[crypto.symbol] = simulatePriceChange(originalCrypto.currentPriceUSD);
                    }
                });
                return newPrices;
            });
        }, 5000);

        return () => clearInterval(interval);
    }, [allCryptos]);

    const totalValueUSD = Object.keys(wallet.balances).reduce((sum, symbol) => {
        const balance = wallet.balances[symbol];
        const price = cryptoPrices[symbol] || 0;
        return sum + (balance * price);
    }, 0);

    return (
        <div className="wallet-overview-card"> { }
            <h2 className="card-title">Pregled Novčanika</h2> { }
            <div className="wallet-value-section"> { }
                <p className="wallet-value-label">Ukupna vrednost:</p> { }
                <p className="wallet-total-value"> { }
                    ${totalValueUSD.toFixed(2)}
                </p>
            </div>
            <h3 className="section-title">Stanje po Kriptovalutama:</h3> { }
            <ul className="crypto-balance-list"> { }
                {Object.keys(wallet.balances).length > 0 ? (
                    Object.keys(wallet.balances).map(symbol => {
                        const balance = wallet.balances[symbol];
                        const price = cryptoPrices[symbol] || 0;
                        const value = balance * price;
                        return (
                            <li key={symbol} className="crypto-balance-item"> { }
                                <span className="crypto-symbol">{symbol}: <span className="crypto-balance">{balance.toFixed(4)}</span></span> { }
                                <span className="crypto-value"> { }
                                    (${price.toFixed(2)}/jedinica) <span className="crypto-value-bold">${value.toFixed(2)}</span> { }
                                </span>
                            </li>
                        );
                    })
                ) : (
                    <p className="text-muted">Vaš novčanik je prazan.</p>
                )}
            </ul>
        </div>
    );
};

export default WalletOverview;