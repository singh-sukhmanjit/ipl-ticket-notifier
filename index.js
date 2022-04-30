const express = require('express');
const app = express();
const dotenv = require('dotenv');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const sgMail = require('@sendgrid/mail');

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const url =
  'https://in.bookmyshow.com/sports/tata-indian-premier-league-2022/ET00325171';
const port = process.env.PORT;

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
      const msg = {
        to: process.env.RECIPIENT,
        from: process.env.SENDER,
        subject: 'IPL ticket notifier',
        text: linkTexts.length
          ? 'IPL Qualifier tickets are available now'
          : 'IPL Qualifier tickets are not yet available',
      };
      sgMail
        .send(msg)
        .then(() => {
          console.log('Email sent');
        })
        .catch((error) => {
          console.error('Failed to send email', error);
        });
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
  checkAvailability();
  setInterval(checkAvailability, process.env.NOTIFICATION_INTERVAL);
});
