/*
This script contains the core and logic of interactivites of the users to the messages 

There are mainly two parts -
A.) Manager input on whether s/he approves the timelog requests via slash commands
B.) Consultant input on whether s/he wants to directly input the timelog entry to Wrike, if approved in A

All these require interactions with Slack, Firebase and Wrike.

*/

const { sendDM } = require('../modules/slack');
const { readTimelogRequest, recordTimelogRequestDecision, recordTimelogSubmission} = require('../modules/database');
const { postWrikeTimelog } = require('../modules/wrike');


// ------------------ Listen to 2 interactivitiies ---------------------
module.exports = app => {app.post('/action', async (req,res) => {
    const interactiveMessage = JSON.parse(req.body.payload);
    //console.log("-----------------------------interactiveMessage------------------------------");
    //console.log(interactiveMessage);
    const databaseKey = interactiveMessage.actions[0].name; //from the 3 step in timesheet, we have saved the database key
    const originalTextMessage = interactiveMessage.original_message.text;

//-------------------- A.) listening to manager's input - approve / reject timelog entry by consultant------------------//
    if(interactiveMessage.callback_id == "timelog_request") {
        const requestApproved = interactiveMessage.actions[0].value === "approved";
        //res.send('Okay.');
        //------------------ 1.) Send acknowledgement on what the manager decided-----------------------
        res.json({
            text: originalTextMessage,
            attachments: [{
                text:  requestApproved ? 'You approved this timelog request.' : 'You rejected this timelog request.'
            }]
        });

        //------------------ 2.) Record decision of manager into database with the required key -----------
        recordTimelogRequestDecision(databaseKey, interactiveMessage.actions[0].value);

        //------------------ 3.) Read timelog request from database using key -------------------------------
        const timelogRequest = await readTimelogRequest(databaseKey);
        //console.log('timelogRequest from Firebase ....');
        //console.log(timelogRequest);

        //------------------ 4.) Send the original timelog requester feedback on the decision---------------
        //------------------ 4a.) If approved, provide option to consultant to sumbmit timelog directly to Wrike---------------   
            if(requestApproved){
                sendDM(timelogRequest.userId, 
                    `Hi! Your timelog request for ${timelogRequest.item.project} of ${timelogRequest.item.hours} hour(s) on ${timelogRequest.item.date} was approved.`,
                    [
                        {
                            "text": "Do you want to submit this timelog entry to Wrike?",
                            "fallback": "You have not triggered an action",
                            "callback_id": "timelog_submission",
                            "color": "#3AA3E5",
                            "attachment_type": "default",
                            "actions": [
                                {
                                    "name": databaseKey,//"submit_button",
                                    "text": "Yes, please submit",
                                    "type": "button",
                                    "value": "submitted"
                                },
                                {
                                    "name": databaseKey,//"submit_button",
                                    "text": "No",
                                    "type": "button",
                                    "value": "no"
                                }
                            ]
                        }
                    ]
                    
                    )            
                
        //------------------ 4b.) Inform, if not approved ---------------   
            } else if (interactiveMessage.actions[0].value === "rejected") {
                sendDM(timelogRequest.userId, 
                    `Hi! Your timelog request for ${timelogRequest.item.project} of ${timelogRequest.item.hours} hour(s) on ${timelogRequest.item.date} was rejected.`)    
            }

//----------------- B.) listening to consultant's input - submit approved timelog entry to Wrike or not--------------------------//
    } else if(interactiveMessage.callback_id == "timelog_submission"){
    
        const submit = interactiveMessage.actions[0].value === "submitted";
        const databaseKey = interactiveMessage.actions[0].name;
        const originalTextMessage = interactiveMessage.original_message.text;

        //-------------------- 1.) Ask consultant if s/he wants to submit timelog entry to Wrike-----------------------------
        res.json({
            text: originalTextMessage,
            attachments: [{
                text:  submit ? 'You submitted this timelog to Wrike.' : 'No wrike timelog entry has been created.'
            }]
        });

        //OUT-OF-SCOPE: no async wait for wrike response, due to limitation of scope

        //--------------------- 2.) Grab the details from Firebase, before firing API call to Wrike --------------------------
        const timelogRequest = await readTimelogRequest(databaseKey);
        const { projectId, date, hours, description } = timelogRequest.item;
        postWrikeTimelog(projectId, date, hours, description); 

        //--------------------- 3.) Record decision of consultant into database --------------------------
        recordTimelogSubmission(databaseKey, interactiveMessage.actions[0].value);

        // console.log('timelogRequest from Firebase ....');
        // const timelogRequest = await readTimelogRequest(databaseKey);
        // console.log(timelogRequest);
   
    }
    
    });

};