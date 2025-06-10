const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation");
const { datesChevauchent } = require("../utils/dateUtils");
exports.createReservation = async (req, res) => {
  const { carId, UserId, dateDebut, dateFin } = req.body;

  try {
    // Étape 1 : récupérer les réservations existantes de cette voiture
    const reservationsExistantes = await Reservation.find({ carId });

    // Étape 2 : vérifier les chevauchements
    const conflit = reservationsExistantes.some((res) =>
      datesChevauchent(
        new Date(dateDebut),
        new Date(dateFin),
        res.dateDebut,
        res.dateFin
      )
    );

    if (conflit) {
      return res
        .status(400)
        .json({ message: "Voiture déjà réservée à cette période." });
    }

    // Étape 3 : créer la réservation
    const nouvelleReservation = new Reservation({
      carId,
      UserId,
      dateDebut,
      dateFin,
    });

    await nouvelleReservation.save();

    res.status(201).json({ success: true, reservation: nouvelleReservation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = router;
