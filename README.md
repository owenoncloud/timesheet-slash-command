# timesheet-slash-command

## Goal
- Enable workflow automation of timelog reminder, request, approval and submission in an organization

## Workflow
- Refer to [this document](https://docs.google.com/document/d/1U2d6o5YV4ywYNwjBSSuvnHYXeme4iQGZJvl-8AhNS5A/edit)

## Stacks
- NodeJS, libraries: "express" (server framework), "body-parser" (rendering of API requests & responses), "axios" (triggering of API calls), "moment" (date calculation)
- Slack (Bot creation)
- Firebase (database)
- Wrike (Timelog & PM Tool - business account required)

## Architecture & Pre-requisites / settings
- Refer to [this diagram](https://drive.google.com/file/d/1UwM00rqu2LXbhHo1RhB6qf0LjEVYuYgB/view?usp=sharing)
- Note the specific Stack logins and keys are not provided here, create your own 

## File structure
- `timesheet-slash-command.js` to run an API server with two endpoints - /timesheet & /action, of which logic is defined under the respective JS files in the "routes" folder.
- `reminder.js` is a cronjob bot to check the time and trigger a reminder.
- `testing.js` is a simple file to trigger a message to verify the functioning of Wrike API.
- The JS files under the "modules" folder are the required interfaces to different systems, namely Slack, Firebase (database), Wrike (PM tool) along with its taskID mapping.
- Note for security reasons, the specific Stack configurations and keys are not provided here, create your own - they are "botToken", managerId", "channelId", "firebasePrivateKey" and "wrikeToken"
 
## Running 
- After installing all dependencies listed in Stacks and configuring your route on the server to port 3000, and run 
    ```sh
    node timesheet-slash-command
    ```
- to run locally (ngrok installation required); and remember to update URLs in the UI of your Slack app
    ```sh
    ngrok http 3000
    ```

## Test-case documentation
| # | Test case | to-do | Expect |
| ------ | ------ | ------ | ------ | 
| 1 | Reminder | trigger `node reminder` | receiving a reminder message in #timesheet channel |
| 2a | timesheet submission (sunny case) |  slash command `/timesheet [date], [project], [description], [hours]` in #timesheet channel. `date` must be in format of YYYY-MM-DD, `hours` must be a number > 0 | An acknowledgement & manager receives an interactive message for approval |
| 2b | timesheet submission (cloudy case) | slash command `/timesheet [date], [project], [description], [hours]` in #timesheet channel. `date` NOT in format of YYYY-MM-DD and/or `hours` NOT a number > 0 | Rejection and instruction for fixing requests | 
| 3a | timesheet approval | Manager clicks "approve" on interactive message | Consultant receives feedback and asked to submit timelog entry |
| 3b | timesheet rejection | Manager clicks "reject" on interactive message | Consultant receives feedback |
| 4a | timelog entry submission | Consultant clicks on "submit" on interactive message | Timelog entry in Wrike |
| 4b | timelog entry non-submission | Consultant clicks on "not submit" on interactive message | No timelog entry in Wrike |

## Documentation
- https://api.slack.com/start/building
- https://api.slack.com/methods/chat.postMessage
- https://api.slack.com/methods/conversations.open
- https://api.slack.com/docs/messages/builder
- https://app.slack.com/block-kit-builder
- https://api.slack.com/legacy/interactive-message-field-guide
- https://firebase.google.com/docs/database/admin/save-data
- https://firebase.google.com/docs/database/admin/retrieve-data
- https://developers.wrike.com/api/v4/timelogs/#create-timelog

## Links (require platform logins)
- https://api.slack.com/apps?new_app=1
- https://console.firebase.google.com
- https://www.wrike.com/workspace.htm
- https://dashboard.ngrok.com/get-started/setup
