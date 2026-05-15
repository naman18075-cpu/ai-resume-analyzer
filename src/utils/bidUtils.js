const { Op } = require("sequelize");
const { Bid } = require("../models");
const { ACTIVE_BID_STATUSES } = require("./constants");

const getActiveBidsCount = (freelancerId) =>
  Bid.count({
    where: {
      freelancerId,
      status: {
        [Op.in]: ACTIVE_BID_STATUSES
      }
    }
  });

module.exports = {
  getActiveBidsCount
};
