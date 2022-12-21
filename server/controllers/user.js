const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  ok,
  badRequest,
  conflict,
  created,
  internalServerError,
  unauthorized,
} = require("../statuses");

const User = require("../models/user");

const { TOKEN_KEY } = process.env;

const register = async (req, res) => {
  try {
    // Get user input
    const { firstName, lastName, email, password } = req.body;

    // Validate user input (Can use Express Validator in Future)
    if (!(email && password && firstName && lastName)) {
      res.status(badRequest).json({
        status: "BadRequest",
        statusCode: badRequest,
        message: "Missing required parameters!",
      });
    }

    // Check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(conflict).json({
        status: "UserExists",
        statusCode: conflict,
        message: "User Already Exist! Please Login.",
      });
    }

    // Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    // Create token
    const token = jwt.sign({ userId: user._id, email }, TOKEN_KEY, {
      expiresIn: "2h",
    });

    // Save user token
    user.token = token;

    // Return new user
    return res.status(created).json({
      status: "UserCreated",
      statusCode: created,
      message: "User is created successfuly!",
      data: user,
    });
  } catch (err) {
    return res.status(internalServerError).json({
      status: "InternalServerError",
      statusCode: internalServerError,
      message: "Something went wrong while creating the user!",
    });
  }
};

const login = async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(badRequest).json({
        status: "BadRequest",
        statusCode: badRequest,
        message: "Missing required parameters!",
      });
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });
    const compare = await bcrypt.compare(password, user.password)

    if (user && compare) {
      // Create token
      const token = jwt.sign({ userId: user._id, email }, TOKEN_KEY, {
        expiresIn: "2h",
      });

      // save user token
      user.token = token;

      // user logged in
      return res.status(ok).json({
        status: "Success",
        statusCode: ok,
        message: "User logged in successfully!",
        data: user
      });
    }

    // Else Case: Unauthorised/Invalid Creds
    return res.status(unauthorized).json({
      status: "Unauthorized",
      statusCode: unauthorized,
      message: "Invalid Credentials, please retry!",
    });
  } catch (err) {
    return res.status(internalServerError).json({
      status: "InternalServerError",
      statusCode: internalServerError,
      message: "Something went wrong while logging in!",
    });
  }
};

module.exports = { login, register };
