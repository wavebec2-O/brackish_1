const express = require('express');
const router = express.Router();
const volunteerController = require('../controllers/volunteerController');

router.use('/', volunteerController);

module.exports = router;
