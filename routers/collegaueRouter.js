const express = require('express');
const router = express.Router();
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware');
const collegaueController = require('../controllers/collegaueController');
const path = require('path');
const weekdayFilterMiddleware = require('../middleware/weekdayFilterMiddleware');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.get('/:userId', collegaueController.getCollegauesByUserId);
router.post(
  '/create/:userId',
  upload.single('cover'),
  collegaueController.createCollegaue
);
router.get('/only/:id', collegaueController.getCollegaueById);

router.put('/:collegaueId', upload.none(), collegaueController.updateCollegaueById);

module.exports = router;
