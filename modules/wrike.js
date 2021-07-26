/*
This scripts contains the API call to Wrike, a project / timelog management SaaS.

*/

const axios = require('axios');
const config = require('../config');
//const projectMappingArray = require('../wrike-mapping');


//----------1.) Send timelog to Wrike, required parameters are taskId, trackDate, hours and comment----------
const postWrikeTimelog = async (taskId, trackedDate, hours, comment) => {
    console.log(taskId);
    try {
        const postTimelogResponse = await axios.post(
            `https://www.wrike.com/api/v4/tasks/${taskId}/timelogs`,
            {
                "comment": comment,
                "hours": hours,
                "trackedDate": trackedDate
            },
            {
                headers: {
                    'Authorization': `Bearer ${config.wrikeToken}`
                }
            }
        );
        //console.log("--------------------postTimelogResponse------------------------------")
        //console.log(postTimelogResponse);

    } catch (error) {
        throw error;
    }

};

//postWrikeTimelog("IEAETITDKQVWJCFG", "2021-07-23", 4, "ppt");


module.exports = {
    postWrikeTimelog
}
