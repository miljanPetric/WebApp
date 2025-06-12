import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const PortfolioChart = ({ wallet, allCryptos }) => {
  const dataForChart = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#5B39EE',
          '#2F4F4F',
          '#DAA520',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#5B39EE',
          '#2F4F4F',
          '#DAA520',
        ],
      },
    ],
  };

  if (wallet && wallet.balances && allCryptos) {
    Object.keys(wallet.balances).forEach(symbol => {
      const balance = wallet.balances[symbol];
      const cryptoInfo = allCryptos.find(c => c.symbol === symbol);
      if (cryptoInfo && balance > 0) {
        dataForChart.labels.push(cryptoInfo.name);
        dataForChart.datasets[0].data.push(balance * cryptoInfo.currentPriceUSD);
      }
    });
  }

  if (dataForChart.labels.length === 0 || dataForChart.datasets[0].data.every(val => val === 0)) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-xl mb-6 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Raspodela Portfolija</h2>
        <p className="text-gray-600">Nema dovoljno podataka za prikaz grafikona (novčanik je prazan ili ima 0 vrednosti).</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Raspodela Portfolija</h2>
      <div className="w-full md:w-1/2 mx-auto"> { }
        <Pie data={dataForChart} />
      </div>
    </div>
  );
};

export default PortfolioChart;