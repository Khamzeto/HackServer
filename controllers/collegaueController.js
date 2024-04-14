const Collegaue = require('../models/Collegaue');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Настройка места для сохранения загруженных файлов
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

exports.createCollegaue = async (req, res) => {
  try {
    const { name, email, work, workTime, cover } = req.body;
    const userId = req.params.userId;

    const collegaue = new Collegaue({
      userId,
      cover,
      name,
      email,
      work,
      workTime,
    });

    await collegaue.save();

    res.status(201).json({ message: 'Collegaue created successfully', collegaue });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCollegauesByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const collegaue = await Collegaue.find({ userId: userId });
    res.status(200).json(collegaue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCollegaueById = async (req, res) => {
  try {
    const collegaueId = req.params.id;
    const collegaue = await Collegaue.findById(collegaueId);
    if (!collegaue) {
      return res.status(404).json({ error: 'Colleague not found' });
    }
    res.status(200).json({ collegaue });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCollegaueById = async (req, res) => {
  try {
    const collegaueId = req.params.collegaueId; // Получаем _id услуги из параметра запроса
    const updates = req.body; // Предполагается, что обновления приходят в теле запроса

    const updatedColleagaue = await Collegaue.findByIdAndUpdate(collegaueId, updates, {
      new: true,
    });

    if (!updatedColleagaue) {
      return res.status(404).json({ message: 'Collegaue not found' });
    }

    res
      .status(200)
      .json({ message: 'Collegaue updated successfully', collegaue: updatedColleagaue });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
