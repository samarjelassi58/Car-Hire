const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const reservationController = require("../controllers/reservation.controller");

router.post("/createreservation", reservationController.createReservation);

module.exports = router;
