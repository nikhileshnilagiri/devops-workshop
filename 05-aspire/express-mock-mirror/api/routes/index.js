const express = require('express');
const router = express.Router();

router.use('/health', require('./health.js'));

router.use('/reflect', require('./data.js'));

module.exports = router;
