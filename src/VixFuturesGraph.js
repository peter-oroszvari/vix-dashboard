// src/VixFuturesGraph.js
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Label } from 'recharts';
import 'react-datepicker/dist/react-datepicker.css';
import useWebSocket from 'react-use-websocket';
import config from './config';


const VixFuturesGraph = () => {
  
  // State variable to store the selected date
  const [selectedDate, setSelectedDate] = useState(new Date());
 
  const [data, setData] = useState([]);

  // You can change here the URL of the websocket! 

  const WS_URL = config.WS_URL;

  const [lastUpdate, setLastUpdate] = useState(new Date());

  
  const { sendMessage } = useWebSocket(WS_URL, {
    onOpen: () => {
      console.log('WebSocket connection established.');
      // Send a message to request initial data after the connection is established
      sendMessage(JSON.stringify({ action: 'sendInitialData' }));
    },
    onMessage: (message) => {
      console.log('Received message:', message.data);
      const parsedMessage = JSON.parse(message.data);

      if (Array.isArray(parsedMessage)) {
        // Separate VIX from other data points
        const vixData = parsedMessage.find((item) => item.symbol === 'VIX');
        const futuresData = parsedMessage.filter((item) => item.symbol !== 'VIX');

        // Sort the futures data by exp-date
        futuresData.sort((a, b) => {
          if (a['exp-date'] < b['exp-date']) {
            return -1;
          }
          if (a['exp-date'] > b['exp-date']) {
            return 1;
          }
          return 0;
        });

        // Merge VIX data and sorted futures data
        setData([vixData, ...futuresData]);

        // Update the last update timestamp
        setLastUpdate(new Date());
      } else {
        console.error('Unexpected data format:', parsedMessage);
        setData([]);
      }
    },
    shouldReconnect: (closeEvent) => true, // Always attempt to reconnect
    retryOnError: true, // Retry connection if there's an error during connection establishment 
  });

    // Format the last update timestamp in US style
    const formattedLastUpdate = lastUpdate.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    // Find the VIX value in the data array
    const actualVix = data.find(item => item.symbol === 'VIX')?.price || 0;

      // Filter out the VIX data point as it's not neeeded for the graph
    const filteredData = data.filter(item => item.symbol !== 'VIX');

    // Find the minimum value from data to set the Y-axis min and max
    const minValue = Math.min(...data.map(item => item.price)) - 1;
    const maxValue = Math.max(...data.map(item => item.price)) + 1;



    const calendarContainer = ({ children }) => {
      return (
        <div style={{ position: 'absolute', zIndex: 1000, marginTop: '0.5em' }}>
          {children}
        </div>
      );
    };

    // Custom tick formatter function
    const tickFormatter = (value) => {
      return value.toFixed(2);
    };

    const CustomizedLabel = ({ x, y, value }) => (
      <text x={x} y={y} dy={-10} fill="#6B6B6B" fontSize={12} textAnchor="middle">{value}</text>
    );
    
    const formatDate = (dateString) => {
      const year = dateString.substring(0, 4);
      const month = dateString.substring(4, 6);
      const day = dateString.substring(6, 8);
      const date = new Date(year, month - 1, day);
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };
    
    const daysUntilExpiration = (dateString) => {
      const year = dateString.substring(0, 4);
      const month = dateString.substring(4, 6);
      const day = dateString.substring(6, 8);
      const currentDate = new Date();
      const expirationDate = new Date(year, month - 1, day);
      const diffInMilliseconds = expirationDate - currentDate;
      return Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));
    };
    
    
    // Custom tooltip component
    const CustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        const price = parseFloat(payload[0].value).toFixed(2);
        const symbol = payload[0].payload.symbol;
        const expDate = formatDate(payload[0].payload['exp-date']);
        const daysToExpire = daysUntilExpiration(payload[0].payload['exp-date']);
        return (
          <div className="custom-tooltip" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderColor: '#E0E0E0', padding: '10px', border: '1px solid #E0E0E0', borderRadius: '5px', fontSize: '10px' }}>
            <p className="label">{`Contract: ${symbol}`}</p>
            <p className="price">{`Last: ${price}`}</p>
            <p className="expires">{`Expires on: ${expDate} in ${daysToExpire} days`}</p>
          </div>
        );
      }
      return null;
    };

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const monthNumberToName = (monthNumber) => {
    return monthNames[monthNumber - 1];
  };
  
  const CustomXTick = ({ x, y, payload }) => {
    const expDate = payload.value;
    const monthNumber = expDate.slice(4, 6);
    const monthName = monthNumberToName(parseInt(monthNumber));
  
    return (
      <text x={x} y={y} dy={10} fill="#6B6B6B" fontSize={12} textAnchor="middle">
        {monthName}
      </text>
    );
  };

  return (
    <div>
      <h2>VIX Futures Term Structure</h2>
      <div style={{ fontSize: '0.8em', color: 'gray', textAlign: 'center', marginBottom: '20px' }}>
        (Last update: {formattedLastUpdate})
      </div>

      <div style={{ width: '50%', height: 300, margin: '0 auto' }}>
        <ResponsiveContainer>
          <LineChart
            width={1200}
            height={300}
            data={filteredData}
            margin={{
              top: 5, right: 30, left: 20, bottom: 5,
            }}
          >
            <CartesianGrid stroke="#E0E0E0" strokeDasharray="3 3" />
            <XAxis
              dataKey="exp-date"
                tick={<CustomXTick />}
                padding={{ left: 20 }}
              />
            <YAxis domain={[minValue, maxValue]} tick={{ fill: '#6B6B6B', fontSize: 12 }} tickFormatter={tickFormatter} />
            <Tooltip
              contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderColor: '#E0E0E0' }}
              labelStyle={{ color: '#333' }}
              itemStyle={{ color: '#333' }}
              content={<CustomTooltip />}
            />
            <Legend />
            <Line type="monotone" dataKey="price" stroke="#3F51B5" strokeWidth={2} dot={{ fill: '#3F51B5', strokeWidth: 2 }}  label={<CustomizedLabel />} />
            <ReferenceLine
                y={actualVix}
                stroke="#F44336"
                strokeDasharray="3 3"
                >
                <Label
                    value={`VIX: ${actualVix}`}
                    position="insideTopRight"
                    fill="#F44336"
                    fontSize={12}
                />
            </ReferenceLine>


          </LineChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
        <div style={{ position: 'relative' }}>
            <DatePicker
                showIcon
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
