const db = require("../database/models");
const Trade = db.trade;
const Op = db.Sequelize.Op;

// Route to get all trades
exports.get = async (req, res) => {
  try {
    // Extract query parameters
    const { type, user_id } = req.query;

    // Define query options based on query parameters
    const queryOptions = {};
    if (type) {
      queryOptions.type = type;
    }
    if (user_id) {
      queryOptions.user_id = user_id;
    }

    // Query trades from the database with optional filters
    const trades = await Trade.findAll({
      where: queryOptions,
      order: [["id", "ASC"]],
      attributes: {
        exclude: ["createdAt", "updatedAt"],
        include: ["timestamp"],
      },
    });

    // Convert timestamp field to number (bigint)
    const tradesWithTimestampAsNumber = trades.map((trade) => ({
      ...trade.toJSON(),
      timestamp: Number(trade.timestamp),
    }));

    // Return the filtered trades as JSON response
    res.status(200).json(tradesWithTimestampAsNumber);
  } catch (error) {
    console.error("Error fetching trades:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    // Query the trade from the database based on the provided ID
    const trade = await Trade.findByPk(id, {
      attributes: { exclude: ["createdAt", "updatedAt"] }, // Exclude createdAt and updatedAt fields
    });

    // If no trade is found, return 404 with an error message
    if (!trade) {
      return res.status(404).json({ message: "ID not found" });
    }

    // Convert timestamp field to number (bigint)
    const tradeWithTimestampAsNumber = {
      ...trade.toJSON(),
      timestamp: Number(trade.timestamp),
    };

    // If the trade is found, return it with a status code of 200
    res.status(200).json(tradeWithTimestampAsNumber);
  } catch (error) {
    console.error("Error fetching trade:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.create = async (req, res) => {
  try {
    // Extract trade data from the request body
    const { type, user_id, symbol, shares, price, timestamp } = req.body;

    // Server-side validation
    if (!type || !user_id || !symbol || !shares || !price || !timestamp) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (type !== "buy" && type !== "sell") {
      return res.status(400).json({ message: "Invalid trade type" });
    }
    if (!Number.isInteger(user_id) || user_id <= 0) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    if (!Number.isInteger(shares) || shares < 10 || shares > 30) {
      return res
        .status(400)
        .json({ message: "Shares must be between 10 and 30" });
    }
    if (!Number.isInteger(price) || price <= 0) {
      return res.status(400).json({ message: "Invalid price" });
    }
    const parsedTimestamp = Number(timestamp);
    if (!Number.isInteger(parsedTimestamp) || parsedTimestamp <= 0) {
      return res.status(400).json({ message: "Invalid timestamp" });
    }

    // Insert the trade into the database using Sequelize
    // Insert the trade into the database using Sequelize
    const newTrade = await Trade.create({
      type,
      user_id,
      symbol,
      shares,
      price,
      timestamp: parsedTimestamp,
    });
    const { createdAt, updatedAt, ...responseTrade } = newTrade.toJSON();
    // Return the created trade
    res.status(201).json(responseTrade);
  } catch (error) {
    console.error("Error creating trade:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.delete = async (req, res) => {
  res.status(405).json({ message: "Method Not Allowed" });
};

exports.update = async (req, res) => {
  res.status(405).json({ message: "Method Not Allowed" });
};

exports.patch = async (req, res) => {
  res.status(405).json({ message: "Method Not Allowed" });
};
