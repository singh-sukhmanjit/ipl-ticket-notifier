const express = require('express');
const app = express();
const port = 3000;

const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const url =
  'https://in.bookmyshow.com/sports/tata-indian-premier-league-2022/ET00325171';
const checkAvailability = async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  browser
    .newPage()
    .then((page) => page.goto(url).then(() => page.content()))
    .then((html) => {
      const $ = cheerio.load(html);
      let linkTexts = [];
      $('a').each(function () {
        linkTexts.push($(this).text());
      });
      linkTexts = linkTexts.filter(
        (t) =>
          t.includes('24 May') ||
          t.includes('25 May') ||
          t.includes('27 May') ||
          t.includes('29 May')
      );
      console.log({ linkTexts });
    })
    .catch((err) => {
      console.error('Some error occured', err);
    })
    .finally(() => {
      browser.close();
    });
};

app.use('/', (_req, res) => {
  res.send('Working fine');
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
  console.log('testing env var sample', process.env.sample);
  checkAvailability();
  // setInterval(checkAvailability, 100);
});
