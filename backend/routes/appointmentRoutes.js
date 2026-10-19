const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

router.get('/', appointmentController.getAllAppointments);
router.post('/', appointmentController.bookAppointment);
router.put('/:id/status', appointmentController.updateAppointmentStatus);
router.get('/dashboard-stats', appointmentController.getDashboardStats);

module.exports = router;