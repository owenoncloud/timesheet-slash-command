/*
This script is used just to test that the configuration can be referenced and APIs to Slack function as expected
*/

const { sendDM, sendCM } = require('./modules/slack');
const config = require('./config');

sendCM(config.channelId,'Hi everyone');
//sendDM(config.managerId, "Hi");