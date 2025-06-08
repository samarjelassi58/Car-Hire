const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const auth = require("../middlewares/auth");
router.post("/login", authController.login);
router.post("/logout", auth, authController.logout);

router.get("/verify", auth, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

module.exports = router;
