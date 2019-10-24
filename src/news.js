const axios = require('axios');

const news = async (query) => {
    return axios.get(`https://omni-monitor.herokuapp.com/archive/${query}`).then((response) => {
        return response.data;
    }).catch((error => {
        console.log(error);
        return [];
    }));
};

module.exports = { news };
