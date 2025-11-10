const express = require("express");
const router = express.Router();
const messageController = require("../controllers/message.controller");
const auth = require("../middlewares/auth");

router.post("/addMessage", messageController.addMessage);
router.get("/getMessages",  auth,messageController.getMessages);
module.exports = router;
