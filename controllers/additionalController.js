const AdditionalModel = require('../models/UploadFile'); // Путь к модели дополнительной таблицы
const path = require('path');
const fs = require('fs');

exports.addAvatarLinkToAdditionalTable = async (userId, avatarUrl) => {
  try {
    // Проверяем, существует ли уже запись для данного пользователя
    let existingRecord = await AdditionalModel.findOne({ userId });

    if (existingRecord) {
      // Если запись уже существует и в ней есть ссылка на аватар
      if (existingRecord.avatarUrl) {
        // Удаляем предыдущий аватар
        fs.unlinkSync(existingRecord.avatarUrl);
      }

      // Обновляем avatarUrl
      existingRecord.avatarUrl = avatarUrl;
      await existingRecord.save();
    } else {
      // Создаем новую запись в дополнительной таблице
      const newRecord = new AdditionalModel({
        userId: userId,
        avatarUrl: avatarUrl,
      });

      // Сохраняем запись в базе данных
      await newRecord.save();
    }

    console.log('Ссылка на аватар успешно добавлена в дополнительную таблицу');
  } catch (error) {
    console.error(
      'Ошибка при добавлении ссылки на аватар в дополнительную таблицу:',
      error
    );
    throw error;
  }
};

exports.addBannerLinkToAdditionalTable = async (userId, bannerUrl) => {
  try {
    // Проверяем, существует ли уже запись для данного пользователя
    let existingRecord = await AdditionalModel.findOne({ userId });

    if (existingRecord) {
      // Если запись уже существует и в ней есть ссылка на баннер
      if (existingRecord.bannerUrl) {
        // Удаляем предыдущий баннер
        fs.unlinkSync(existingRecord.bannerUrl);
      }

      // Обновляем bannerUrl
      existingRecord.bannerUrl = bannerUrl;
      await existingRecord.save();
    } else {
      // Создаем новую запись в дополнительной таблице
      const newRecord = new AdditionalModel({
        userId: userId,
        bannerUrl: bannerUrl,
      });

      // Сохраняем запись в базе данных
      await newRecord.save();
    }

    console.log('Ссылка на баннер успешно добавлена в дополнительную таблицу');
  } catch (error) {
    console.error(
      'Ошибка при добавлении ссылки на баннер в дополнительную таблицу:',
      error
    );
    throw error;
  }
};

exports.getAvatarUrl = async (req, res) => {
  try {
    const additionalInfo = await AdditionalModel.findOne({
      userId: req.params.userId,
      avatarUrl: { $exists: true, $ne: null }, // Добавляем фильтр для avatarUrl
    });
    if (!additionalInfo || !additionalInfo.avatarUrl) {
      return res.status(404).json({ message: 'Аватар не найден' });
    }

    // Путь к файлу аватара из базы данных
    const avatarPath = additionalInfo.avatarUrl;

    // Проверяем существование файла
    if (fs.existsSync(avatarPath)) {
      // Отправка файла обратно клиенту
      res.sendFile(path.resolve(avatarPath));
    } else {
      return res.status(404).json({ message: 'Файл аватара не найден' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

exports.getBannerUrl = async (req, res) => {
  try {
    const additionalInfo = await AdditionalModel.findOne({
      userId: req.params.userId,
      bannerUrl: { $exists: true, $ne: null }, // Добавляем фильтр для bannerUrl
    });
    if (!additionalInfo || !additionalInfo.bannerUrl) {
      return res.status(404).json({ message: 'Баннер не найден' });
    }

    // Путь к файлу баннера из базы данных
    const bannerPath = additionalInfo.bannerUrl;

    // Проверяем существование файла
    if (fs.existsSync(bannerPath)) {
      // Отправка файла обратно клиенту
      res.sendFile(path.resolve(bannerPath));
    } else {
      return res.status(404).json({ message: 'Файл баннера не найден' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};
exports.getImages = async (req, res) => {
  try {
    const additionalInfo = await AdditionalModel.findOne({
      userId: req.params.userId,
      $or: [
        { avatarUrl: { $exists: true, $ne: null } },
        { bannerUrl: { $exists: true, $ne: null } },
      ],
    });

    if (!additionalInfo) {
      return res.status(404).json({ message: 'Изображения не найдены' });
    }

    const images = {};

    if (additionalInfo.avatarUrl) {
      const avatarPath = additionalInfo.avatarUrl;
      if (fs.existsSync(avatarPath)) {
        const avatarData = fs.readFileSync(avatarPath);
        images.avatar = avatarData;
      } else {
        console.error('Файл аватара не найден:', avatarPath);
        return res.status(404).json({ message: 'Файл аватара не найден' });
      }
    }

    if (additionalInfo.bannerUrl) {
      const bannerPath = additionalInfo.bannerUrl;
      if (fs.existsSync(bannerPath)) {
        const bannerData = fs.readFileSync(bannerPath);
        images.banner = bannerData;
      } else {
        console.error('Файл баннера не найден:', bannerPath);
        return res.status(404).json({ message: 'Файл баннера не найден' });
      }
    }

    if (Object.keys(images).length === 0) {
      return res.status(404).json({ message: 'Файлы изображений не найдены' });
    }

    res.status(200).json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};
