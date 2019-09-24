


function updateEnv(newValues = null, removeValues = null){
    // SAMPLE VALUES DATA STRUCTURE
    // "values": [
    //     {"key": "channelById", "value": JSON.stringify(someData)}
    // ]
    let oldValues, updatedValues;
    // Gets previous Env state
    oldValues = getEnvState();
    // oldValues = [{"key": "testing", "value": helperFunctionsStr}, {"key": "postmanApiKey", "value": "3a464852f4e04cdba66ac7d998bc5d9a"}]

    if(oldValues && !newValues & !removeValues){
        console.log("first env IF");
        // IF no arguments returns previous Env state
        requestUpdateEnv(oldValues);
        // return oldValues;
    }else if(oldValues && removeValues){
        console.log("second env IF");


        // Note: removeValues is an array of keys

        // Updates the old values with unwanted Env values removed
        oldValues = removeOldValues(oldValues, removeValues);

        if(!newValues){
            // Returns old values with unwanted Env values removed if no Env values to add
            // return oldValues;
            requestUpdateEnv(oldValues);
        }
    }

    // Checks if has new values to add to Env state
    // Add new values to state
    if(newValues){
        console.log("Third env IF: Merge");


        // merge values
        updatedValues = mergeValues(oldValues, newValues);
        requestUpdateEnv(updatedValues);
        // return updatedValues;
    }
}



function removeOldValues(oldValues, removeValues){
    let updatedValues = [];
        for(const item of oldValues){
            const inOldValues = _.some(removeValues, "key", item.key)
            if(!inOldValues){
                updatedValues.push(item);
            }
        }
    return updatedValues;
}

function mergeValues(oldValues, newValues){

    // Removes old values to make room for the new ones that override them if they have any overlap
    const oldKeys = _.map(oldValues, 'key');
    const newKeys = _.map(newValues, 'key');
    console.log("oldKeys:" + JSON.stringify(oldKeys));
    console.log("newKeys:" + JSON.stringify(newKeys));

    const overlap = _.intersection(oldKeys, newKeys);

    console.log("overlap:" + JSON.stringify(overlap));

    oldValues = _.filter(oldValues, function(n) {
        return _.some( overlap ,'key', n.key) === false;
    });

    // merge old and new values
    console.log("oldValues:" + JSON.stringify(oldValues));
    console.log("newValues:" + JSON.stringify(newValues));

    const updatedValues = _.flatten([oldValues, newValues]);
    console.log("mergeValues():" + JSON.stringify(updatedValues))
    return updatedValues;
}
  

function requestUpdateEnv(values){
    const update = {
        "description": "This is a sample POST request",
        "url": "https://api.getpostman.com/environments/5302990-a5a347b1-b01a-47ac-a729-0cd76449dad0",
        "method": "PUT",
        "header": [
            {
                "key": "Content-Type",
                "value": "application/json"
            },
            {
                "key": "x-api-key",
                "value": "3a464852f4e04cdba66ac7d998bc5d9a"
            }
        ],
        "body": {
            'mode': 'raw',
            'raw': JSON.stringify({
            "environment": {
            "name": "connector",
                "values": values
        }})
        }
    };


    pm.sendRequest(update, function (err, res) {
        console.log(err ? err : res.json());
      });
}


function validId(envVarData, id){
    const isValidItem = _.some(envVarData, "id", id);
    return isValidItem;
}


function getEnvState(){
    const getEnv = {
        "description": "This is a sample GET request",
        "url": "https://api.getpostman.com/environments/5302990-a5a347b1-b01a-47ac-a729-0cd76449dad0",
        "method": "GET",
        "header": [
            {
                "key": "Content-Type",
                "value": "application/json"
            },
            {
                "key": "x-api-key",
                "value": "3a464852f4e04cdba66ac7d998bc5d9a"
            }
        ]
    }
    let respTest;
    pm.sendRequest(getEnv, function (err, res) {
        console.log(err ? err : res.json());
        if(res){
            console.log("responseBody Test:" + res["Response Body"]);
            console.log("responseBody Test:" + JSON.stringify(res.json()["environment"]["values"]));
            respTest = JSON.stringify(res.json()["environment"]["values"]);

            // return JSON.parse(JSON.stringify(res.json().environment.values));
            // oldValues = res.json().environment.values;
            // console.log("Get initial Env State:" + JSON.stringify(res));
        }
    });

    return respTest;
}


////////////
const updateEnvStr = updateEnv.toString();
const removeOldValuesStr = removeOldValues.toString();
const mergeValuesStr = mergeValues.toString();
const requestUpdateEnvStr = requestUpdateEnv.toString();
const validIdStr = validId.toString();
const getEnvStateStr = getEnvState.toString()
const helperFunctionsStr = updateEnvStr + removeOldValuesStr + mergeValuesStr + requestUpdateEnvStr + validId + getEnvStateStr;

const setHelperEnvCallbacks = {
    "description": "This is a sample POST request",
    "url": "https://api.getpostman.com/environments/5302990-a5a347b1-b01a-47ac-a729-0cd76449dad0",
    "method": "PUT",
    "header": [
        {
            "key": "Content-Type",
            "value": "application/json"
        },
        {
            "key": "x-api-key",
            "value": "3a464852f4e04cdba66ac7d998bc5d9a"
        }
    ],
    "body": {
        'mode': 'raw',
        'raw': JSON.stringify({
        "environment": {
        "name": "connector",
            "values": [{"key": "testing", "value": helperFunctionsStr}, {"key": "postmanApiKey", "value": "3a464852f4e04cdba66ac7d998bc5d9a"}]
    }})
    }
};

if(pm.environment.has("testing") === false){
    pm.sendRequest(setHelperEnvCallbacks, function (err, res) {
        console.log(err ? err : res.json());
    });
}