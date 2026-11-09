const express = require("express");
const router = express.Router();
const messageController = require("../controllers/message.controller");
const auth = require("../middlewares/auth");
const requireRole = require("../middlewares/role");

router.post("/addMessage", messageController.addMessage);
router.get("/getMessages", auth, requireRole(["admin"]), messageController.getMessages);
router.patch("/:id/status", auth, requireRole(["admin"]), messageController.updateMessageStatus);
router.delete("/:id", auth, requireRole(["admin"]), messageController.deleteMessage);
module.exports = router;
