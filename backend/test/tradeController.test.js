const request = require("supertest");
const app = require("../server");

describe("POST /trades", () => {
  it("should create a new trade", async () => {
    const newTrade = {
      type: "buy",
      user_id: 1,
      symbol: "AC",
      shares: 28,
      price: 162,
      timestamp: 1591514264000,
    };

    try {
      const response = await request(app)
        .post("/api/trades")
        .send(newTrade)
        .expect(201);

      // Parse the timestamp field in the response as int
      response.body.timestamp = parseInt(response.body.timestamp);

      // Remove createdAt and updatedAt from the response body
      delete response.body.createdAt;
      delete response.body.updatedAt;

      // Check if the response body matches the expected trade
      expect(response.body).toEqual({
        id: 1,
        ...newTrade,
      });
    } catch (error) {
      console.error("Error:", error);
      throw error; // Rethrow the error to fail the test if there's an issue
    }
  });

  it("should create another new trade", async () => {
    const newTrade = {
      type: "sell",
      user_id: 1,
      symbol: "AC",
      shares: 28,
      price: 162,
      timestamp: 1591514264000,
    };

    try {
      const response = await request(app)
        .post("/api/trades")
        .send(newTrade)
        .expect(201);

      // Parse the timestamp field in the response as int
      response.body.timestamp = parseInt(response.body.timestamp);

      // Remove createdAt and updatedAt from the response body
      delete response.body.createdAt;
      delete response.body.updatedAt;

      // Check if the response body matches the expected trade
      expect(response.body).toEqual({
        id: 2,
        ...newTrade,
      });
    } catch (error) {
      console.error("Error:", error);
      throw error; // Rethrow the error to fail the test if there's an issue
    }
  });
});

describe("GET /trades", () => {
  it("should return all trades", async () => {
    const response = await request(app).get("/api/trades").expect(200);

    // Assuming that these objects are in the collection
    const expectedTrades = [
      {
        id: 1,
        type: "buy",
        user_id: 1,
        symbol: "AC",
        shares: 28,
        price: 162,
        timestamp: 1591514264000,
      },
      {
        id: 2,
        type: "sell",
        user_id: 1,
        symbol: "AC",
        shares: 28,
        price: 162,
        timestamp: 1591514264000,
      },
    ];

    // Remove createdAt and updatedAt from each trade object in the response body
    const tradesWithoutTimestamps = response.body.map((trade) => {
      delete trade.createdAt;
      delete trade.updatedAt;
      return trade;
    });

    // Check if the response body matches the expected trades
    expect(tradesWithoutTimestamps).toEqual(expectedTrades);
  });

  it("should return filtered trades by type", async () => {
    const response = await request(app).get("/api/trades?type=buy").expect(200);

    // Assuming that these objects match the filter
    const expectedTrades = [
      {
        id: 1,
        type: "buy",
        user_id: 1,
        symbol: "AC",
        shares: 28,
        price: 162,
        timestamp: 1591514264000,
      },
    ];

    // Remove createdAt and updatedAt from each trade object in the response body
    const tradesWithoutTimestamps = response.body.map((trade) => {
      delete trade.createdAt;
      delete trade.updatedAt;
      return trade;
    });

    // Check if the response body matches the expected filtered trades
    expect(tradesWithoutTimestamps).toEqual(expectedTrades);
  });

  it("should return filtered trades by user_id", async () => {
    const response = await request(app)
      .get("/api/trades?user_id=1")
      .expect(200);

    // Assuming that these objects match the filter
    const expectedTrades = [
      {
        id: 1,
        type: "buy",
        user_id: 1,
        symbol: "AC",
        shares: 28,
        price: 162,
        timestamp: 1591514264000,
      },
      {
        id: 2,
        type: "sell",
        user_id: 1,
        symbol: "AC",
        shares: 28,
        price: 162,
        timestamp: 1591514264000,
      },
    ];

    // Remove createdAt and updatedAt from each trade object in the response body
    const tradesWithoutTimestamps = response.body.map((trade) => {
      delete trade.createdAt;
      delete trade.updatedAt;
      return trade;
    });

    // Check if the response body matches the expected filtered trades
    expect(tradesWithoutTimestamps).toEqual(expectedTrades);
  });
});

describe("GET /trades/:id", () => {
  it("should return the trade with the given ID", async () => {
    const response = await request(app).get("/api/trades/1").expect(200);

    // Assuming that this object exists
    const expectedTrade = {
      id: 1,
      type: "buy",
      user_id: 1,
      symbol: "AC",
      shares: 28,
      price: 162,
      timestamp: 1591514264000,
    };

    // Remove createdAt and updatedAt from the response body
    delete response.body.createdAt;
    delete response.body.updatedAt;

    // Check if the response body matches the expected trade
    expect(response.body).toEqual(expectedTrade);
  });

  it("should return 404 if the trade with the given ID does not exist", async () => {
    await request(app)
      .get("/api/trades/100")
      .expect(404, { message: "ID not found" });
  });
});

describe("DELETE /trades/:id", () => {
  it("should return 405", async () => {
    await request(app).delete("/api/trades/1").expect(405);
  });
});
