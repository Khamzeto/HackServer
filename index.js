const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./routers/authRouter');
const serviceRouter = require('./routers/serviceRouter');
const collegaueRouter = require('./routers/collegaueRouter');
const uploadFileRouter = require('./routers/uploadFileRouter');
const cors = require('cors');
const path = require('path'); // Добавляем модуль path для работы с путями

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);
app.use('/file', uploadFileRouter);
app.use('/service', serviceRouter);
app.use('/collegaue', collegaueRouter);

// Middleware для обслуживания статических файлов из папки 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = 4000;

const start = async () => {
  try {
    await mongoose.connect(
      'mongodb://localhost:27017/booke', // Замените 'mydatabase' на имя вашей базы данных
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 2000,
        appName: 'mongosh 2.0.2',
      }
    );

    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  } catch (e) {
    console.error(e);
  }
};

start();
