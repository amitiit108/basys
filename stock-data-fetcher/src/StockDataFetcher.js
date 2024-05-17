import React, { useState } from 'react';
import './StockDataFetcher.css';

function StockDataFetcher() {
  const [inputDate, setInputDate] = useState('');
  const [stockData, setStockData] = useState(null);
  const [noResult, setNoResult] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}${inputDate}`);
      const data = await response.json();
      
      if (data.data.length === 0) {
        setNoResult(true);
        setStockData(null);
      } else {
        setNoResult(false);
        setStockData(data.data[0]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (event) => {
    setInputDate(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchData();
  };

  return (
    <div>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            value={inputDate} 
            onChange={handleInputChange} 
            placeholder="Enter date (e.g., 5-January-2000)" 
            data-testid="app-input" 
          />
          <button type="submit" data-testid="submit-button">Search</button>
        </form>
      </div>
      <div className="result-container">
        {noResult ? (
          <div data-testid="no-result">No Results Found</div>
        ) : stockData ? (
          <ul data-testid="stock-data">
            <li>Open: {stockData.open}</li>
            <li>Close: {stockData.close}</li>
            <li>High: {stockData.high}</li>
            <li>Low: {stockData.low}</li>
          </ul>
        ) : null}
      </div>
    </div>
  );
}

export default StockDataFetcher;
