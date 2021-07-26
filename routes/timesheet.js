/*
This script is where the core and logic of slash command /timesheet go
From listening to the slash command, validating the inputs,
then to transformation of data for saving to database.
And finally send a DM message to the manager.
*/

const { sendDM } = require('../modules/slack');
const { saveTimelogRequest } = require('../modules/database');
const projectMapping = require('../wrike-mapping');
const config = require('../config');

// ------------------ A.) Listen to slash command /timesheet ---------------------
module.exports = app => {app.post('/timesheet', async (req,res) => {
        const {text, user_id} = req.body; // grab the attributes from the slash command JSON;
        //console.log(req.body);      //res.send('OK');
        // ---------------Good example for text="2021-07-23, Project A, ppt, 4"
        parameterArray = text.split(","); 
        parameterArray = parameterArray.map( str => str.trim()); // trim leading white space

        // console.log(parameterArray[1] + parameterArray[2]);  // console.log(parameterArray[0]);   // console.log(Number(parameterArray[3]));
        // console.log(isValidDate(parameterArray[0]));     // console.log(isNaN(Number(parameterArray[3])));
        
        // -------------- 1a.) if not in required formats, reject the request-----------
        // -------------- 1b.) return acknowledgement if okay--------------------------
        if(parameterArray.length != 4){ // has to have 4 parameters
            res.json({
                text: `Please put in the four parameters required.`
            });
        } else if( ! isValidDate(parameterArray[0])){ // has to be in YYYY-MM-DD format
            res.json({
                text: `Please put in a valid date format in YYYY-MM-DD.`
            });
        } else if( isNaN(Number(parameterArray[3])) | Number(parameterArray[3])<=0 ){ // has to be a number >0 
            res.json({
                text: `Please put in only numbers to parameter "#hours".`
            });
        } else {
            res.json({
                text: `Thanks for submitting your timesheet of *${text}*. We will notify the manager now for approval.`
            });
        }

        //----------------- 2a.) do the mapping and get the Wrike projectId ------------
        var project_key = parameterArray[1].replace(/\s/g,'').toLowerCase();
        var project_id = projectMapping[project_key] 
        // console.log(project_id);
        // console.log(projectMapping["projecta"]);
    
        //----------------- 2b.) create data object to be savd in Firebase --------------
        item = {
            date: parameterArray[0],
            project: parameterArray[1],
            description: parameterArray[2],
            hours: Number(parameterArray[3]),
            projectId: project_id
        }

        // ---------------- 2c.) save timelog request to Firebase ---------------------
        const key = saveTimelogRequest(user_id, item); 
        console.log(key);
    
        // -----------------3.)  send a message to manager for approval of requested timelog------------------
        sendDM(config.managerId, `Hi manager, please approve the timelog of *${text}* by <@${user_id}>`,
            [
                {
                    "text": "Do you approve this timelog entry?",
                    "fallback": "You are unable to decide",
                    "callback_id": "timelog_request",
                    "color": "#3AA3E4",
                    "attachment_type": "default",
                    "actions": [
                        {
                            "name": key, //"auth_button"
                            "text": "Yes I approve",
                            "type": "button",
                            "value": "approved"
                        },
                        {
                            "name": key, //"auth_button"
                            "text": "No",
                            "type": "button",
                            "value": "rejected"
                        }
                    ]
                }
            ]
        
        )
    });
};


//helper function to check date format
function isValidDate(dateString) {
    var regEx = /^\d{4}-\d{2}-\d{2}$/;
    if(!dateString.match(regEx)) return false;  // Invalid format
    var d = new Date(dateString);
    var dNum = d.getTime();
    if(!dNum && dNum !== 0) return false; // NaN value, Invalid date
    return d.toISOString().slice(0,10) === dateString;
}
  