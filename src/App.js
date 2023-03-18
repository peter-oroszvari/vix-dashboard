// src/App.js
import React from 'react';
import './App.css';
import VixFuturesGraph from './VixFuturesGraph';

const App = () => {
  // Dummy data for the VIX futures term structure
  const data = [
    { date: '1M', value: 20 },
    { date: '2M', value: 22 },
    { date: '3M', value: 24 },
    { date: '4M', value: 23 },
    { date: '5M', value: 25 },
    { date: '6M', value: 26 },
  ];

  return (
    <div className="App">
      <VixFuturesGraph data={data} />
    </div>
  );
};

export default App;
