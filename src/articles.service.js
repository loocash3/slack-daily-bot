const axios = require('axios');
const debug = require('debug')('slash-command-template:index');
const qs = require('querystring');
const signature = require('./verifySignature');
const apiUrl = 'https://slack.com/api';

const send = (req, res) => {
    const { text, trigger_id, channel_id } = req.body;

    if (signature.isVerified(req)) {
        const data = {
            token: process.env.SLACK_ACCESS_TOKEN,
            trigger_id,
            channel: channel_id
        };
        axios.post(`${apiUrl}/chat.postMessage`, qs.stringify(data))
            .then((result) => {
                //Response text
                const responseText = 'Mock text';
                res.send(responseText);
            }).catch((err) => {
                debug('err: %o', err);
                res.sendStatus(500);
            });
    } else {
        debug('Verification token mismatch');
        res.sendStatus(404);
    }
};

module.exports = { send };