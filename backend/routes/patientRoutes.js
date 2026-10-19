const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

router.get('/', patientController.getAllPatients);
router.post('/', patientController.addPatient);
router.delete('/:id', patientController.deletePatient);

module.exports = router;