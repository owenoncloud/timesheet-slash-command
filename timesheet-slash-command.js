/*
This scripts initialize the app, serve the endpoints for which the connected Slack workspace will call to.
- Express server webframework 

Specific users' messages and interactions are stored to Firebase, a document-based NoSQL database, for state management and future reference
*/

const express = require('express');
const bodyParser = require('body-parser'); // allow easily process of POST request
//const { send } = require('process');
const app = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ---- specific the route endpoints, these have to be entered into Slack bot-----
require('./routes/timesheet')(app);
require('./routes/action')(app);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Slack bot server has started on port ${PORT}`);  
})