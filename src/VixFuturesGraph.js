// src/VixFuturesGraph.js
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import 'react-datepicker/dist/react-datepicker.css';


const VixFuturesGraph = ({ data }) => {
  // Replace this value with the actual VIX value
  const actualVix = 15;
  // Find the minimum value from data and actualVix, then subtract 2
  const minValue = Math.min(...data.map(item => item.value), actualVix) - 2;

  // State variable to store the selected date
  const [selectedDate, setSelectedDate] = useState(new Date());

  const calendarContainer = ({ children }) => {
    return (
      <div style={{ position: 'absolute', zIndex: 1000, marginTop: '0.5em' }}>
        {children}
      </div>
    );
  };

  return (
    <div>
      <h2>VIX Futures Term Structure</h2>
      <div style={{ width: '75%', height: 300, margin: '0 auto' }}>
        <ResponsiveContainer>
          <LineChart
            width={1200}
            height={300}
            data={data}
            margin={{
              top: 5, right: 30, left: 20, bottom: 5,
            }}
          >
            <CartesianGrid stroke="#E0E0E0" strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fill: '#6B6B6B', fontSize: 12 }} />
            <YAxis domain={[minValue, 'auto']} tick={{ fill: '#6B6B6B', fontSize: 12 }} />
            <Tooltip
              contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderColor: '#E0E0E0' }}
              labelStyle={{ color: '#333' }}
              itemStyle={{ color: '#333' }}
            />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#3F51B5" strokeWidth={2} dot={{ fill: '#3F51B5', strokeWidth: 2 }} />
            <ReferenceLine y={actualVix} stroke="#F44336" strokeDasharray="3 3" label={<text fill="#F44336" fontSize={12}>Actual VIX</text>} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
        <div style={{ position: 'relative' }}>
            <DatePicker
                selected={selectedDate}
                onChange={date => setSelectedDate(date)}
                maxDate={new Date()} // Disables dates after today
                calendarContainer={calendarContainer}
             />
        </div>
      </div>
    </div>
  );
};

export default VixFuturesGraph;
