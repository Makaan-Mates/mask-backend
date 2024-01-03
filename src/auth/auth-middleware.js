const jwt = require("jsonwebtoken");

require('dotenv').config();

// Token Verification
const verifyToken = (req, res, next) => {
  const authHeaders = req.headers.authorization;
  const token = authHeaders && authHeaders.split(" ")[1];

  if (token === null)
    return res.status(401).json({ message: "token not found" });


  jwt.verify(token,process.env.JWT_SECRET,(err, decoded) => {

    if (err) {
      console.log(err)
      res.status(401).json({
        message: "invalid token",
      });
      return;
    } else {
      req.user = decoded;
      next();
    }
  });
};

module.exports = { verifyToken };