const express = require('express');
const router = express.Router({ mergeParams: true });

const { checkHealth } = require("../controllers/health");

router.route("/").get(checkHealth);

module.exports = router;