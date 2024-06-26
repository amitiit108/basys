const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

const db = require("./database/models");
db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

require("./routes/trades")(app);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome to application." });
});

module.exports = app; 
