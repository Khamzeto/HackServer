const express = require('express');
const {
  uploadAvatar,
  uploadBanner,
  uploadAvatarAndBanner,
} = require('../controllers/uploadFileController');

const router = express.Router();
const multer = require('multer');
const {
  getBannerUrl,
  getAvatarUrl,
  getImages,
} = require('../controllers/additionalController');
const upload = multer({ dest: 'uploads/' });

// Роут для загрузки аватара
router.post('/:userId/avatar', upload.single('avatar'), uploadAvatar);

// Роут для загрузки баннера
router.post('/:userId/banner', upload.single('banner'), uploadBanner);

// Роут для получения URL аватара по идентификатору пользователя
router.get('/:userId/avatar', getAvatarUrl);

// Роут для получения URL баннера по идентификатору пользователя
router.get('/:userId/banner', getBannerUrl);
router.get('/:userId/images', getImages);

module.exports = router;
