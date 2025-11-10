const Message = require("../models/Message");
exports.addMessage = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, messageObject, message } = req.body;

    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs sont requis",
      });
    }

    const newMessage = new Message({
      firstName,
      lastName,
      email,
      phoneNumber,
      messageObject,
      message,
    });

    await newMessage.save();

    res.status(201).json({
      success: true,
      message: "Message ajouté avec succès",
      data: newMessage,
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout du message :", error.message);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des messages :", error.message);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};