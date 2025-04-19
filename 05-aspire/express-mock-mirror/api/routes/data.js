const express = require("express");
const {
    getData,
    deleteData,
    reflectPayload,
    validateDeleteData,
} = require("../controllers/data");
const { validateRequestBody } = require("../middlewares/validateRequestBody");
const router = express.Router({ mergeParams: true });

router.route("/:id").get(getData);

router.route("/:id").delete(
    validateDeleteData, 
    validateRequestBody, 
    deleteData
);

router.route("/").post(reflectPayload);

module.exports = router;
