const axios = require('axios');
const debug = require('debug')('slash-command-template:index');
const qs = require('querystring');
const signature = require('./verifySignature');
const apiUrl = 'https://slack.com/api';

const send = (req, res) => {
    const {text, trigger_id, channel_id} = req.body;

    if (signature.isVerified(req)) {
        const data = {
            token: process.env.SLACK_ACCESS_TOKEN,
            trigger_id,
            channel: channel_id
        };
        axios.post(`${apiUrl}/chat.postMessage`, qs.stringify(data))
            .then((result) => {
                //Response text
                const response = {
                    blocks: [
                        {
                            type: 'section',
                            text: {
                                type: 'mrkdwn',
                                text: '*Results*\nYour articles about ' + text //Place for articles
                            }
                        },
                        {
                            type: 'actions',
                            elements: [
                                {
                                    type: 'button',
                                    text: {
                                        type: 'plain_text',
                                        text: 'Show more',
                                        emoji: true
                                    },
                                    value: text
                                }
                            ]
                        }
                    ]
                };
                res.json(response);
            }).catch((err) => {
            debug('err: %o', err);
            res.sendStatus(500);
        });
    } else {
        debug('Verification token mismatch');
        res.sendStatus(404);
    }
};

const sendMore = (req, res) => {
    const body = JSON.parse(req.body.payload);
    console.log(body.actions[0].value);
    const {response_url} = body;

    console.log(body.response_url);
    if (signature.isVerified(req)) {
        const data = {
            text: '*More articles*\n',//Place for more articles
            blocks: [
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: '*Results*\nMore articles about ' + body.actions[0].value //Place for articles
                    }
                },
                {
                    type: 'actions',
                    elements: [
                        {
                            type: 'button',
                            text: {
                                type: 'plain_text',
                                text: 'Show more',
                                emoji: true
                            },
                            value: body.actions[0].value
                        }
                    ]
                }
            ]
        };
        axios.post(response_url, data)
            .then((result) => {
                console.log(result);
                res.send('');
            }).catch((err) => {
                console.log(err);
                res.sendStatus(500);
        });
    } else {
        debug('Verification token mismatch');
        res.sendStatus(404);
    }
};

module.exports = {send, sendMore};