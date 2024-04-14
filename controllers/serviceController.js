const Service = require('../models/Service');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Настройка места для сохранения загруженных файлов

exports.createService = async (req, res) => {
  try {
    const {
      cover,
      name,
      description,
      price,
      currency,
      additionalCost,
      tags,
      everyndays,
      weekdays,
      interval,
      bufferTime,
      notificationsMe,
      notificationsClient,
      numberClient,
      nameClient,
      seeInfo,
      alwaysService,
      everyDay,
      onlyDay,
      nearlyDays,
      fromDate,
      beforeDate,
      workTime,
    } = req.body;
    const userId = req.params.userId;

    const service = new Service({
      userId,
      cover,
      name,
      description,
      price,
      currency,
      additionalCost,
      tags,
      everyndays,
      weekdays,
      interval,
      bufferTime,
      notificationsMe,
      notificationsClient,
      numberClient,
      nameClient,
      seeInfo,
      alwaysService,
      everyDay,
      onlyDay,
      nearlyDays,
      fromDate,
      beforeDate,
      workTime,
    });

    await service.save();

    res.status(201).json({ message: 'Service created successfully', service });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.updateServiceById = async (req, res) => {
  try {
    const serviceId = req.params.serviceId;
    const updates = req.body;
    const updatedService = await Service.findByIdAndUpdate(serviceId, updates, {
      new: true,
    });

    if (!updatedService) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res
      .status(200)
      .json({ message: 'Service updated successfully', service: updatedService });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.status(200).json({ service });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getServicesByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const services = await Service.find({ userId: userId });
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
