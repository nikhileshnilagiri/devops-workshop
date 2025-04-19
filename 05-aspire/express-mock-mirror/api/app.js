const express = require("express");
const app = express();
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
const { Logger } = require("./logger");
const axios = require("axios");
const path = require("path")

const logger = new Logger();

app.use(express.json());
app.use(express.static('public'));

app.use("/api", require("./routes"));

app.get('/carbon-receipt/:CODE', async (req, res) => {
    try {
        const code = req.params.CODE;

        // Dummy data to send in the POST request
        const requestData = 
            {
                "customerIdentifier": `REEWILD-${code}`,
                "products": [
                    {
                        "id": "3813",
                        "name": "Mushroom stronganoff, creamy mash",
                        "qty": 1,
                        "cost": 595
                    },
                    {
                        "id": "194",
                        "name": "Coke Zero",
                        "qty": 1,
                        "cost": 140
                    }
                ],
                "siteId": "ucl-main-campus",
                "transactionId": `txn-${Math.ceil(Math.random(900000))+100000}`,
                "timestamp": `${new Date().toISOString()}`,
                "totalAmount": 7.35,
                "metadata": {
                    "cardIssuer": "mastercard",
                    "deviceId": "pos-terminal-01",
                    "paymentMode": "card"
                }
            }
        // let base_url = process.env["services__i-lolly-api__http__0"] || "https://api.reewild.dev/integrations/lolly"

        let base_url = "https://reewild-api-prod.azure-api.net/v2/integrations/lolly"
        


        const response = await axios.post(
            `${base_url}/transactions?api-version=1.0`,
            requestData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    "X-Api-Key": "q0ByV4YUqmzTZGPjBJCG1yD3zwrkdC5o7XoBbIE8mwadpKwa2M8uozzp13u3xlHY"
                }
            }
        );
        
        console.log("API Response:", response.status, response.data);

        if (response.status === 200 || response.status === 201) {
            const filePath = path.resolve(__dirname, "public", "success.html");
            console.log("Serving file:", filePath);
            res.sendFile(filePath);
        } else {
            res.status(500).json({ error: "API call failed", details: response.data });
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.use(errorHandler);

const PORT = 80;

const startServer = async () => {    
    app.listen(PORT, "0.0.0.0", () => {
        logger.info(`Server Running on Port ${PORT}`);
        console.log(`Server Running on Port ${PORT}`);
    });
};

startServer();
