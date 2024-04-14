const User = require('../models/User');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { secret } = require('../config');
const nodemailer = require('nodemailer');
const emailConfig = require('../smtp/email');
const {
  addBannerLinkToAdditionalTable,
  addAvatarLinkToAdditionalTable,
} = require('./additionalController');
const { uploadBanner } = require('./uploadFileController');
require('dotenv').config();
const fs = require('fs');

const generateAccessToken = (id, roles) => {
  const payload = {
    id,
    roles,
  };
  return jwt.sign(payload, secret, { expiresIn: '24h' });
};

class AuthController {
  async registration(req, res) {
    try {
      const { email, password } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Ошибка при регистрации' });
      }
      const candidate = await User.findOne({ email });
      if (candidate) {
        return res
          .status(400)
          .json({ message: 'Пользователь c таким email уже существует' });
      }
      const hashPassword = bcrypt.hashSync(password, 7);
      const user = new User({ email, password: hashPassword });
      await user.save();
      return res.json({ message: 'Пользователь успешно добавлен' });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: 'Ошибка при регистрации' });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body; // Получаем только email и пароль из запроса
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ message: `Пользователь с email ${email} не найден` });
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: 'Пароль неверный' });
      }
      const token = generateAccessToken(user._id, user.roles);
      return res.json({ token, userId: user._id });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: 'Ошибка при входе' });
    }
  }
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Пользователь с этим email не найден' });
      }

      // Создаем токен для сброса пароля
      const token = jwt.sign({ email }, secret, { expiresIn: '1h' });

      // Отправляем электронное письмо с инструкциями по сбросу пароля
      const transporter = nodemailer.createTransport(emailConfig);
      const mailOptions = {
        from: emailConfig.auth.user,
        to: email,
        subject: 'Сброс пароля',
        html: `
          <p>Для сброса пароля перейдите по следующей ссылке:</p>
          <a href="http://${process.env.BASE_URL}/change_password/${token}">Сбросить пароль</a>
        `,
      };
      await transporter.sendMail(mailOptions);

      return res.json({
        message: 'Инструкции по сбросу пароля отправлены на ваш email',
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ошибка при сбросе пароля' });
    }
  }
  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;

      const decodedToken = jwt.verify(token, secret);
      const email = decodedToken.email;

      // Поиск пользователя по email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Пользователь не найден' });
      }

      // Хеширование нового пароля
      const hashedPassword = bcrypt.hashSync(newPassword, 7);

      // Обновление пароля пользователя
      await User.updateOne({ email }, { password: hashedPassword });

      // Возвращаем успешный ответ
      return res.json({ message: 'Пароль успешно изменен' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ошибка при сбросе пароля' });
    }
  }

  async updateUserSettings(req, res) {
    try {
      const { userId } = req.params;
      const {
        avatar,
        banner,
        name,
        pageTitle,
        description,
        seeBanner,
        seeAvatar,
        seeTitleDesc,
      } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }
      if (avatar) user.avatar = avatar;
      if (banner) user.banner = banner;
      if (name) user.name = name;
      if (pageTitle) user.pageTitle = pageTitle;
      if (description) user.description = description;
      user.seeBanner = seeBanner;
      user.seeAvatar = seeAvatar;
      user.seeTitleDesc = seeTitleDesc;
      await user.save();

      // Возвращаем успешный ответ
      return res.json({ message: 'Настройки пользователя успешно обновлены' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ошибка при обновлении настроек пользователя' });
    }
  }

  async getUserData(req, res) {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }
      return res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }
}

module.exports = new AuthController();
