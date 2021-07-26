/*
This script runs every hour to check the time
if it is Friday 4pm server local time, it will remind all consultants to fill out the timesheets on the channel #timesheet
if it is Monday 8am server local time, it will remind again.
OUT OF SCOPE: Further improvement: to check database to see if certain users have submitted at least one timelog entry / all entries sum to at least 40 hours

For the purpose of illustration, this will be manually triggered.
One can also use chat.scheduleMessage
*/

//const moment = require('moment');
const {sendCM} = require('./modules/slack');
const config = require('./config');


const sendReminder = () => {

    sendCM(config.channelId, "Hi everyone, you should submit your timesheet today.", // message as fallback as per doc
	[
		{
			"type": "section",
			"text": {
				"type": "plain_text",
				"text": "Hi everyone, you should submit your timesheet today."
			}
		},
		{
			"type": "section",
			"text": {
				"type": "plain_text",
				"text": "Enter your timelog entries here with slash command: /timesheet [date], [project], [description], [hours]."
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Note: date must be in format of *YYYY-MM-DD*; project has to be in Wrike already; hours must be a *number>0* "
			}
		}
	]
    )

}



const checkSpecificDateTime = async () => {//async function
    
	//test
    // var date = new Date();
	// console.log(date);
	// var d = date.getDay(); 
	// var h = date.getHours();
	// console.log(d);
	// console.log(h);

    // if(date.getDay() === 6 && date.getHours() === 8) {
    //     console.log("FILL OUT your timesheet!");
	// 	sendReminder();
    // }

	//--------remind before end of the week on Friday at 4pm local time------
    var date = new Date();
    if(date.getDay() === 5 && date.getHours() === 16) {
        console.log("FILL OUT your timesheet!");
		sendReminder();
    }

	//---------remind everyone to submit their timesheets ------------
	if(date.getDay() === 1 && date.getHours() === 8) {
        console.log("FILL OUT your timesheet!");
		sendReminder();
    }

}

sendReminder();
//setInterval(checkSpecificDateTime,10000);

setInterval(checkSpecificDateTime,3600000); //run everyhour