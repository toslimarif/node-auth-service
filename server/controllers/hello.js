const { ok } = require("../statuses");

const hello = (req, res) => {
  return res.status(ok).json({
    status: "OK",
    statusCode: ok,
    message: "Hello from the Other Side!",
  });
};

module.exports = { hello };
