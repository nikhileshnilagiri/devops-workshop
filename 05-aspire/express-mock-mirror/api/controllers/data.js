const asyncHandler = require("../middlewares/asyncHandler");
const { param } = require("express-validator");
const ErrorResponse = require("../utils/ErrorResponse");

let mockData = [
    {
        id: 1,
        item: "Item 1",
    },
    {
        id: 2,
        item: "Item 2",
    },
    {
        id: 3,
        item: "Item 3",
    },
    {
        id: 4,
        item: "Item 4",
    },
];

exports.reflectPayload = asyncHandler(async (req, res) => {
    const payload = req.body;

    return res.json(payload);
});

exports.getData = asyncHandler(async (req, res) => {
    const { id } = req.params;

    let data = mockData.filter((item) => item.id == id);
    data = data[0];

    if(!data) throw new ErrorResponse("Item With ID Not Found", 404)

    return res.json(data);
});

exports.validateDeleteData = [
    param("id").exists().withMessage("ID Is Required").bail(),
    param("id").custom(async (value, { req }) => {
        let exists = mockData.filter((item) => item.id == value);

        if (!exists.length) throw new ErrorResponse("Item With ID Not Found", 400);

        return true;
    }),
];

exports.deleteData = asyncHandler(async (req, res) => {
    const { id } = req.params;

    mockData = mockData.filter((item) => item.id != id);

    return res.json({ data: mockData });
});
