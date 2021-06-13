const { response } = require("express");
const fetch = require("node-fetch");
const API_KEY = process.env["API_KEY"];
const url = `http://apilayer.net/api/live?access_key=${API_KEY}&currencies=EUR,GBP,CAD,PLN&source=USD&format=1`;
module.exports = async function getCurrencyRate() {
  return fetch(url).then((response) => {
    return response.json();
  });
};
