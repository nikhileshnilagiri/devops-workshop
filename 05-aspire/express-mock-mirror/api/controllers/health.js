const asyncHandler = require("../middlewares/asyncHandler");
const { Logger } = require("../logger");

const logger = new Logger();

exports.checkHealth = asyncHandler(async (req, res) => {
    logger.info("Health Check Endpoint Invoked");
    console.log("Health Check Endpoint Invoked");
    return res.json({ message: "Running OK" });
});