function adminAuth(req, res, next) {
  const expectedKey = process.env.ADMIN_KEY;
  const suppliedKey = req.header("x-admin-key");

  if (!expectedKey || expectedKey === "change-this-admin-key") {
    return res.status(503).json({
      message: "Set a unique ADMIN_KEY in backend/.env before using admin routes."
    });
  }

  if (!suppliedKey || suppliedKey !== expectedKey) {
    return res.status(401).json({ message: "Invalid admin key." });
  }

  next();
}

module.exports = adminAuth;
