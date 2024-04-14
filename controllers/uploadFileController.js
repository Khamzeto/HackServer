const User = require('../models/User'); // Путь к модели пользователя
const {
  addAvatarLinkToAdditionalTable,
  addBannerLinkToAdditionalTable,
  uploadAvatarAndBannery,
} = require('./additionalController');
const path = require('path');
const fs = require('fs');

exports.uploadAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    user.avatar = 'uploads/' + req.file.filename;
    await user.save();

    await addAvatarLinkToAdditionalTable(req.params.userId, user.avatar);

    res.status(200).json({ message: 'Аватар успешно загружен' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

exports.uploadBanner = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    user.banner = 'uploads/' + req.file.filename;
    await user.save();

    await addBannerLinkToAdditionalTable(req.params.userId, user.banner);

    res.status(200).json({ message: 'Баннер успешно загружен' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};
