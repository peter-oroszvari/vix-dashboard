// src/VixFuturesGraph.js
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

const VixFuturesGraph = ({ data }) => {
  // Replace this value with the actual VIX value
  const actualVix = 15;
  // Find the minimum value from data and actualVix, then subtract 2
  const minValue = Math.min(...data.map(item => item.value), actualVix) - 2;

  return (
    <div>
      <h2>VIX Futures Term Structure</h2>
      <div style={{ width: '75%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart
            width={1200}
            height={300}
            data={data}
            margin={{
              top: 5, right: 30, left: 20, bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[minValue, 'auto']}/>
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
            <ReferenceLine y={actualVix} stroke="red" strokeDasharray="3 3" label="Actual VIX" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default VixFuturesGraph;
