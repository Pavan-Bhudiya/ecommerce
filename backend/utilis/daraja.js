const axios = require('axios');
require('dotenv').config();

// 1. GET ACCESS TOKEN
const getAccessToken = async () => {
  const url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';

  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString('base64');

  const response = await axios.get(url, {
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });

  return response.data.access_token;
};

// 2. FORMAT PASSWORD
const generatePassword = () => {
  const timestamp = new Date()
    .toISOString()
    .replace(/[^0-9]/g, '')
    .slice(0, 14);

  const passkey = process.env.MPESA_PASSKEY;
  const shortcode = process.env.MPESA_SHORTCODE;

  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

  return { password, timestamp };
};

module.exports = {
  getAccessToken,
  generatePassword,
};