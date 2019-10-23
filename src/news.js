const axios = require('axios');

const googleNews = (query) => {
  const promise = axios.post(`https://gnews.io/api/v3/search?q=${query}&token=2de28b05d6616843e2b7a7de38383861&max=1`);

  return promise;
};

module.exports = { googleNews };
