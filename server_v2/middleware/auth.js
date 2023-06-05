import jwt from "jsonwebtoken";

// middleware for authorization
export const verifyToken = (req, res, next) => {
  try {
    // from front-end
    let token = req.headers["authorization"]; ///lower case

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // grab the token
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }
 
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(500).json({ message: "Invalid Token" });
  }
};
