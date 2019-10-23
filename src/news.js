const axios = require('axios');

const news = (query) => {
  const promise = axios.post(`https://omni-monitor-stage.herokuapp.com/archive/${query}`);

  Promise.all([promise]).then(([results]) => {
      return results;
  });
};

module.exports = { news };
