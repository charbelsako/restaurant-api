function isAdmin(req, res, next) {
  if (req.user.type === "admin") {
    next(null, true);
  } else {
    res.status(401).json({ msg: "User is not an admin" });
  }
}

module.exports = { isAdmin };
