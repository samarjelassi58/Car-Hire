const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const requireRole = require("../middlewares/role");
const userController = require("../controllers/user.controller");

router.post("/createUser", userController.createUser);
router.get("/", auth, requireRole(["admin"]), userController.listUsers);
router.get("/:id", auth, requireRole(["admin"]), userController.getUser);
router.put("/:id", auth, requireRole(["admin"]), userController.updateUser);
router.delete("/:id", auth, requireRole(["admin"]), userController.deleteUser);

module.exports = router;
