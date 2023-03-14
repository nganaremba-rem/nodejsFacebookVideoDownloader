// setup express
const express = require("express");
const app = express();
const cors = require("cors");
const os = require("os");
const puppeteer = require("puppeteer");
// if not in production import dotenv
const isDevelopment = process.env.NODE_ENV !== "development";
if (isDevelopment) {
  require("dotenv").config();
}
// Get PORT
const PORT = process.env.PORT || 3001;
const hostName = isDevelopment ? "localhost" : os.hostname();

// Setup middlwares
app.use(express.json());
app.use(cors());

// Puppeteer
const puppeteerFn = async (url) => {
  const browser = await puppeteer.launch({ headless: true });
  const newPage = await browser.newPage();

  await newPage.goto(url);
  const aTag = await newPage.waitForSelector(".widePic > a");
  const fullLink = await aTag.evaluate((e) => e.href);

  const link = decodeURIComponent(
    fullLink.replace(new RegExp(".+src=", "gi"), "")
  );

  return link;
};

// API Request
app.post("/getFbVideoLink", async (req, res) => {
  const { url } = req.body;

  const search = new RegExp("www", "gi");

  const mbasicUrl = url.replace(search, "mbasic");

  const link = await puppeteerFn(mbasicUrl);
  res.json({
    downloadLink: link,
  });
});

app.listen(PORT, () => console.log(`http://${hostName}:${PORT}`));
