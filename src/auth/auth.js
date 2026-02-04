import jwt from "jsonwebtoken";

export function authenticate(req, res, next) {
  const token = req.cookies.adminToken;

  if (!token) {
    return res.status(401).json({ error: "Unauthenticated" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET||"default_secret");
    req.userid = payload.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token. Please log in again" });
  }
}

export default authenticate;