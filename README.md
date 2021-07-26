# timesheet-slash-command

## Goal
- Enable workflow automation of timelog remdiner, request, approval and submission in an organization

## Workflow
- Refer to [this document](https://docs.google.com/document/d/1U2d6o5YV4ywYNwjBSSuvnHYXeme4iQGZJvl-8AhNS5A/edit)

## Stacks
- NodeJS, libraries: express (server framework), body-parser (rendering of API requests & responses), axios (triggering of API), moment (date calculation)
- Slack (Bot creation)
- Firebase (database)
- Wrike (Timelog & PM Tool - business account required)

## Architecture & Pre-requisties / settings
- Refer to [this diagram](https://drive.google.com/file/d/1LPJ9dDWKej6RKAaXndM-GZXluOHZ6WFt/view?usp=sharing)
- Note the Stack specific files and keys are not provided here, create your own 

## Running 
- After installing all dependencies and configuring your route on the server, run 
    ```sh
    node timesheet-slash-command
    ```
- or run locally (ngrokinstallation required)
    ```sh
    ngrok http 3000
    ```
## Test-case documentation
| # | Test case | to-do | Expect |
| ------ | ------ | ------ | ------ | 
| 1 | Reminder | trigger `node reminder` | receiving a reminder message in #timesheet channel |
| 2a | timesheet submission (sunny case) |  slash command `/timesheet [date], [project], [description], [hours]` in #timesheet channel. `date` must be in format of YYYY-MM-DD, `hours` must be a number > 0 | An acknowledgement & manager receives an interactive message for approval |
| 2b | timesheet submission (cloudy case) | slash command `/timesheet [date], [project], [description], [hours]` in #timesheet channel. `date` NOT be in format of YYYY-MM-DD and/or `hours` NOT a number > 0 | Rejection and instruction for fixing requests | 
| 3a | timesheet approval | Manager clicks "approve" on interactive message | Consultant receives feedback and asked to submit timelog entry |
| 3b | timesheet rejection | Manager clicks "reject" on interactive message | Consultant receives feedback |
| 4a | timelog entry submission | Consultant clicks on "submit" on interactive message | Timelog entry in Wrike |
| 4b | timelog entry non-submission | Consultant clicks on "not submit" on interactive message | No timelog entry in Wrike |

## Documentation
https://api.slack.com/start/building
https://api.slack.com/methods/chat.postMessage
https://api.slack.com/methods/conversations.open
https://api.slack.com/docs/messages/builder
https://app.slack.com/block-kit-builder
https://api.slack.com/legacy/interactive-message-field-guide
https://firebase.google.com/docs/database/admin/save-data
https://firebase.google.com/docs/database/admin/retrieve-data
https://developers.wrike.com/api/v4/timelogs/#create-timelog

## Links (require platform login)
https://api.slack.com/apps?new_app=1
https://console.firebase.google.com
https://www.wrike.com/workspace.htm
https://dashboard.ngrok.com/get-started/setup
