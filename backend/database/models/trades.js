const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Trades = sequelize.define('Trades', {
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    symbol: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shares: {
      type: DataTypes.SMALLINT,
      allowNull: false,
    },
    price: {
      type: DataTypes.MEDIUMINT,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  });

  return Trades;
};
