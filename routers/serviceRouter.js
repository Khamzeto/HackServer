const express = require('express');
const router = express.Router();
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware');
const serviceController = require('../controllers/serviceController');
const path = require('path');
const weekdayFilterMiddleware = require('../middleware/weekdayFilterMiddleware');

// Конфигурация multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

/* Применяем middleware аутентификации к роутеру
router.use(authMiddleware);
*/

router.get('/only/:id', serviceController.getServiceById);
router.get('/:userId', serviceController.getServicesByUserId);
router.post('/create/:userId', upload.single('cover'), serviceController.createService);

router.put('/:serviceId', upload.none(), serviceController.updateServiceById);

module.exports = router;
