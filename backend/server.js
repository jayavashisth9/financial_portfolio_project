const mysql = require('mysql2');

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',      
  user: 'root',           
  password: 'n3u3da!',           
  database: 'portfolio_manager_project', 
});

// Promisify the pool query method for easier async/await usage
const promisePool = pool.promise();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;
app.use(cors());

// Middleware
app.use(bodyParser.json()); // Parse incoming JSON requests

// Basic route to check if server is running
app.get('/', (req, res) => {
  res.send('Portfolio Management API');
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

promisePool.getConnection()
  .then(connection => {
    console.log('Connected to MySQL database!');
    connection.release();
  })
  .catch(error => {
    console.error('Error connecting to MySQL database:', error);
  });

  // Route to get all portfolio items
app.get('/portfolio', async (req, res) => {
    try {
      const [rows] = await promisePool.query('SELECT * FROM portfolio');
      res.json(rows);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      res.status(500).send('Internal Server Error');
    }
});
  
// Route to add a new portfolio item
// Route to add a new portfolio item
app.post('/portfolio', async (req, res) => {
    const { stockTicker, volume, price } = req.body;

    console.log('Request Body:', req.body);
    
    // Basic validation
    if (!stockTicker || !volume || !price) {
      return res.status(400).send('All fields are required');
    }
  
    try {
      const [result] = await promisePool.query(
        'INSERT INTO portfolio (stockTicker, volume, price) VALUES (?, ?, ?)',
        [stockTicker, volume, price]
      );
      res.status(201).json({ id: result.insertId, stockTicker, volume, price });
    } catch (error) {
      console.error('Error adding portfolio item:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
// Route to delete a portfolio item
app.delete('/portfolio/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const [result] = await promisePool.query('DELETE FROM portfolio WHERE id = ?', [id]);
      
      if (result.affectedRows === 0) {
        return res.status(404).send('Portfolio item not found');
      }
  
      res.status(200).send('Portfolio item deleted');
    } catch (error) {
      console.error('Error deleting portfolio item:', error);
      res.status(500).send('Internal Server Error');
    }
});
  
  