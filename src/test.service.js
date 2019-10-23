const news = require('./news');


const send = async (req, res) => {

    const result = await  news.news('schibsted');

    const result2 = result.reduce((accumulator, currentValue) => {
        accumulator.push(currentValue.title);
        currentValue.links.map(link => {
            accumulator.push(link.url);
        });
        return accumulator;
    }, ['*Results*']).join('\n');

    res.json(result2);

};

module.exports = { send };
