/////////////// GLOBAL HELPERS
// const _ = require(lodash);

// const _ = require(lodash);


if(pm.environment.has('test')){
    // console.log(pm.environment.get('test'));
    // function cb(){
    //     pm.environment.get('test');
    //     return 
    // }
    eval(pm.environment.get('test'));
    logger();
}


function updateEnv(newValues = null, removeValues = null){
    // SAMPLE VALUES DATA STRUCTURE
    // "values": [
    //     {"key": "channelById", "value": JSON.stringify(someData)}
    // ]

    // Gets previous Env state
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
    let oldValues, updatedValues;
    pm.sendRequest(getEnv, function (err, res) {
        console.log(err ? err : res.json());
        if(res){
            oldValues = JSON.parse(res).environment.values;
        }
    });

    if(oldValues && !newValues & !removeValues){
        // IF no arguments returns previous Env state
        requestUpdateEnv(oldValues);
        // return oldValues;
    }else if(oldValues && removeValues){
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
    const overlap = _.intersection(oldKeys, newKeys);
    oldValues = _.filter(oldValues, function(n) {
        return _.some( overlap ,'key', n.key) === false;
    });

    // merge old and new values
    const updatedValues = _.flatten([oldValues, newValues]);
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