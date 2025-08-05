import React, { useState, useEffect } from "react";
import axios from "axios";  // To make HTTP requests

function App() {
  // State to store portfolio items
  const [portfolio, setPortfolio] = useState([]);
  const [stockTicker, setStockTicker] = useState('');
  const [volume, setVolume] = useState('');
  const [price, setPrice] = useState('');

  // Fetch portfolio items from the backend
  useEffect(() => {
    axios.get("http://localhost:3001/portfolio")
      .then((response) => {
        setPortfolio(response.data);  // Set portfolio data to state
      })
      .catch((error) => {
        console.error("There was an error fetching the portfolio data:", error);
      });
  }, []);

  // Handle form submission to add a new portfolio item
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sending POST request to backend...");

    // Send POST request to the backend to add the new portfolio item
    axios.post("http://localhost:3001/portfolio", {
      stockTicker,
      volume,
      price,
    })
      .then((response) => {
        setPortfolio([...portfolio, response.data]); // Add the new item to the portfolio state
        setStockTicker('');
        setVolume('');
        setPrice('');
      })
      .catch((error) => {
        console.error("There was an error adding the portfolio item:", error);
      });
  };

  return (
    <div className="App">
      <h1>Portfolio Management</h1>

      {/* Form to add a new portfolio item */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Stock Ticker"
          value={stockTicker}
          onChange={(e) => setStockTicker(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Volume"
          value={volume}
          onChange={(e) => setVolume(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <button type="submit">Add Portfolio Item</button>
      </form>

      {/* List of portfolio items */}
      <ul>
        {portfolio.map((item) => (
          <li key={item.id}>
            {item.stockTicker} - {item.volume} shares at ${item.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
