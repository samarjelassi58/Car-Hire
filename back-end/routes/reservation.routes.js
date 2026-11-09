const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const requireRole = require("../middlewares/role");
const reservationController = require("../controllers/reservation.controller");

router.post("/", auth, reservationController.createReservation);
router.get("/my", auth, reservationController.listMyReservations);
router.get("/", auth, requireRole(["admin"]), reservationController.listReservations);
router.get("/:id", auth, reservationController.getReservation);
router.patch("/:id/status", auth, requireRole(["admin"]), reservationController.updateReservationStatus);
router.delete("/:id", auth, reservationController.cancelReservation);

router.post("/createReservation", auth, reservationController.createReservation);
module.exports = router;
