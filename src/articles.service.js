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
                const response = {
                    blocks: [
                        {
                            type: 'section',
                            text: {
                                type: 'mrkdwn',
                                text: '*Approval Request*\nYour approval is requested to make an offer to <http://example.com|Florence Tran>.'
                            }
                        },
                        {
                            type: 'context',
                            elements: [
                                {
                                    type: 'mrkdwn',
                                    text: '<http://example.com|View applicant>'
                                }
                            ]
                        },
                        {
                            type: 'actions',
                            elements: [
                                {
                                    type: 'button',
                                    text: {
                                        type: 'plain_text',
                                        text: 'Approve',
                                        emoji: true
                                    }
                                },
                                {
                                    type: 'button',
                                    text: {
                                        type: 'plain_text',
                                        text: 'Reject',
                                        emoji: true
                                    }
                                },
                                {
                                    type: 'overflow',
                                    options: [
                                        {
                                            text: {
                                                type: 'plain_text',
                                                text: 'Follow',
                                                emoji: true
                                            },
                                            value: 'value-0'
                                        },
                                        {
                                            text: {
                                                type: 'plain_text',
                                                text: 'Activity feed',
                                                emoji: true
                                            },
                                            value: 'value-1'
                                        },
                                        {
                                            text: {
                                                type: 'plain_text',
                                                text: 'Details',
                                                emoji: true
                                            },
                                            value: 'value-3'
                                        }
                                    ]
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

module.exports = { send };