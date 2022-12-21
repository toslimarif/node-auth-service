const jwt = require("jsonwebtoken");
const { forbidden, unauthorized } = require("../statuses");

const { TOKEN_KEY } = process.env;

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(forbidden).json({
      status: "Forbidden",
      statusCode: forbidden,
      message: "A token is required for authentication",
    });
  }
  try {
    const decoded = jwt.verify(token, TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(unauthorized).json({
      status: "Unauthorized",
      statusCode: unauthorized,
      message: "Invalid Token, please retry Login!",
    });
  }
  return next();
};

module.exports = verifyToken;
