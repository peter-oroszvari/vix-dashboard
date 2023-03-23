# VIX Futures Term Structure Dashboard

This project visualizes the VIX Futures Term Structure using React and Recharts. It fetches data from a WebSocket endpoint, which you can set up yourself for testing purposes.

The main component is `VixFuturesGraph.js`, which handles the WebSocket connection, data processing, and chart rendering. It displays the VIX Futures data as a line chart with labels for each data point and a tooltip that shows the contract symbol, last price, and expiration date when hovering over a data point.

## Example Dataset

To test the project, you can set up your own WebSocket server to provide the following example dataset:

[
{"symbol": "VXM3", "price": "24.1", "exp-date": "20230621"},
{"symbol": "VXK3", "price": "23.8", "exp-date": "20230517"},
{"symbol": "VXN3", "price": "24.45", "exp-date": "20230719"},
{"symbol": "VXQ3", "price": "24.35", "exp-date": "20230816"},
{"symbol": "VIX", "price": "22.26", "exp-date": "NaN"},
{"symbol": "VXV3", "price": "24.55", "exp-date": "20231018"},
{"symbol": "VXJ3", "price": "23.6", "exp-date": "20230419"},
{"symbol": "VXU3", "price": "24.6", "exp-date": "20230920"},
{"symbol": "VXH3", "price": "21.2", "exp-date": "20230322"}
]


Replace the WebSocket URL in `VixFuturesGraph.js` with your own server's URL, and make sure your server sends the data in the same format as the example dataset.

## Setting up the project

1. Clone the repository.
2. Run `npm install` to install the required dependencies.
3. Set up your own WebSocket server and replace the WebSocket URL in `VixFuturesGraph.js`.
4. Run `npm start` to start the development server.
5. Open your browser and go to `http://localhost:3000` to see the VIX Futures Term Structure dashboard.

## Testing/Showcase

To see a live example of the VIX Futures Term Structure dashboard, visit the following link: [https://volatrade.pro/vix-dashboard/](https://volatrade.pro/vix-dashboard/)

Please note that this showcase may not contain real-time data, as the backend is still under development. Nevertheless, you can use it to get a better understanding of how the dashboard looks and functions.
