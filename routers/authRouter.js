const Router = require('express');
const router = new Router();
const controller = require('../controllers/authController');
const { check } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Указываем папку, куда сохранять загруженные файлы
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Используем оригинальное имя файла
  },
});
const upload = multer({ storage: storage });

router.post(
  '/registration',
  [
    check('email', 'Имя пользователя не может быть пустым').notEmpty(),
    check('password', 'Пароль должен быть больше 8').isLength({
      min: 1,
      max: 30,
    }),
  ],
  controller.registration
);

// Вход пользователя
router.post('/login', controller.login);

// Запрос на сброс пароля
router.post('/forgot_password', controller.forgotPassword);

// Сброс пароля
router.post('/reset_password', controller.resetPassword);
router.put(
  '/:userId/update_data',
  upload.single('banner'),
  controller.updateUserSettings
);
router.get('/:userId/get_data', authMiddleware, controller.getUserData);

module.exports = router;
