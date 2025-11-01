const express = require('express');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", async (req, res) => {
    return res.status(200).json({
        success: true,
        data: {
            timestamp: Date.now(),
            message: "Uptime server is active!"
        }
    })
})

app.get("/api/v1/proxy", async (req, res) => {
    if (!req.query.url) return res.json({
        success: false,
        message: "Masukan url website!"
    })
    try {
        const response = await axios.get("https://api.vreden.my.id/api/v1/tools/proxy?region=us3&url=" + encodeURIComponent(req.query.url))
        const $ = cheerio.load(response.data.result.content);
        const body = $('body').text();
        const result = JSON.parse(body);
        return res.json({
            success: true,
            data: result
        })
    } catch (error) {
        console.error(error)
        res.json({
            success: false,
            message: "Telah terjadi kesalahan pada sistem"
        })
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'icons.png'));
});

app.listen(PORT, () => {
  console.log(`CDN server running at http://localhost:${PORT}`);
});