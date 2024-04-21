// weekdayAvailabilityMiddleware.js

const Service = require('../models/Student');

const weekdayAvailabilityMiddleware = async (req, res, next) => {
  try {
    const currentDayOfWeek = new Date().getDay(); // Текущий день недели (0 - воскресенье, 1 - понедельник, ..., 6 - суббота)

    let availableServices = [];

    console.log(currentDayOfWeek);

    if (currentDayOfWeek === 0 || currentDayOfWeek === 6) {
      availableServices = await Service.find({
        weekdays: 0,
      });
    } else {
      availableServices = await Service.find({
        $or: [{ weekdays: 1 }, { weekdays: { $exists: false } }],
      });
    }

    req.availableServices = availableServices;
    next();
  } catch (error) {
    console.error('Error in weekdayAvailabilityMiddleware:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = weekdayAvailabilityMiddleware;
