/*
This scripts contains the API calls to Slack, which will be used by other modules

One could also use the lib Node Slack SDK package (github.com/slackapi/node-slack-sdk) directly
const { WebClient, LogLevel } = require("@slack/web-api");
*/


const axios = require('axios');
const config = require('../config');

//-----------------Sending a channel message directly-------------------------
const sendCM = async (channelId, message, blocks) => {

    try {
        const postResponse = await axios.post(
            'https://slack.com/api/chat.postMessage',
            {
                channel: channelId,
                text:  message,
                blocks: JSON.stringify(blocks)
            },
            {
                headers: {
                    'Authorization': `Bearer ${config.botToken}`
                }
            }
        );
        //console.log("----------------------------postResponse-----------------------------")
        //console.log(postResponse);


    } catch (error) {
        throw error;
    }
};


//-----------------Sending a direct message to a user-------------------------

const sendDM = async (userId, message, attachments) => {

    try {
        const conversationResponse = await axios.post(
            'https://www.slack.com/api/conversations.open',
            {
                users: userId
            },
            {
                headers: {
                    'Authorization': `Bearer ${config.botToken}`
                }
            }
        );
        //console.log("--------------------conversationResponse------------------------------")
        //console.log(conversationResponse);

        const postResponse = await axios.post(
            'https://slack.com/api/chat.postMessage',
            {
                channel: conversationResponse.data.channel.id,
                text:  message, //'Coming from local nodejs'
                attachments: JSON.stringify(attachments)
            },
            {
                headers: {
                    'Authorization': `Bearer ${config.botToken}`
                }
            }
        );
        //console.log("----------------------------postResponse-----------------------------")
        //console.log(postResponse);


    } catch (error) {
        throw error;
    }

};

module.exports = {
    sendDM,
    sendCM
}