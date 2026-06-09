const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

  try {

    const authHeader =
      req.headers.authorization;

    // CHECK TOKEN EXISTS
    if (!authHeader) {

      return res.status(401).json({
        message: "No token provided",
      });

    }

    // GET TOKEN
    const token =
      authHeader.split(" ")[1];

    // VERIFY TOKEN
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // SAVE USER INFO
    req.user = decoded;

    next();

  } catch (err) {

    return res.status(401).json({

      message:
        "Invalid or expired token",

    });

  }

};

module.exports = authMiddleware;