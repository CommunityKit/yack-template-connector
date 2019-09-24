let threadsList;
let selected;
let byId = pm.request.url.path[1] === "threads" && pm.request.url.path.length;
let hasThreads = pm.environment.has("allThreads");

// IF ALREADY made request to the getChannelByID end point then the app should find and return the existing threads

let threads;


if(byId){
    if(!hasThreads){
        pm.environment.set("selectedChannelId",pm.request.url.path[0]);
        const idResponse = makeThreads(parseInt(pm.request.url.path[0]), _.random(1,10));
        updateChannel(null, idResponse);
    }else{
        threadsList = JSON.parse(pm.environment.get("allThreads"));
        
        // Check if current thread is already in list
        const inList = _.some(threadsList, "channel_id", parseInt(pm.request.url.path[0]));
        if(inList === false){
            // Create threads
            const idResponse = makeThreads(parseInt(pm.request.url.path[0]), _.random(1,10));
            updateChannel(threadsList, idResponse);
        }else{
            // Find and return existing threads
            const foundThreads = _.filter(threadsList, "channel_id", parseInt(pm.request.url.path[0]))
            updateChannel(threadsList, foundThreads);
        }
    }
    // const index = _.findIndex(threadsList, "channel_id", parseInt(pm.request.url.path[0]));
    
    // updateChannel(threadsList[index]);
}
// else if(!byId && hasThreads){
//     pm.environment.get("allThreads")
//     // Returns all /threads endpoint
// }

// function setThreads(){
//     pm.sendRequest('https://ab302e5a-1ed0-45bd-80bf-e6e2677321f2.mock.pstmn.io/threads', function (err, res) {
//         if (err) {
//             console.log(err);
//         } else {
//             pm.environment.set("allThreads", res.body)
//             // pm.environment.set("allThreads", res.body)
//         }
//     });
//     const threadsList = pm.environment.get("allThreads");
//     return threadsList;
// }

function updateChannel(allThreads, currentThreads){
    let values;
    if(!!allThreads){
        values = [
                    {"key": "allThreads", "value": JSON.stringify(allThreads)},
                    {"key": "idResponse", "value": JSON.stringify(currentThreads)},
                    {"key": "selectedChannelId", "value": pm.request.url.path[0]}
                ]
    }else{
        values = [
                    {"key": "idResponse", "value": JSON.stringify(currentThreads)},
                    {"key": "selectedChannelId", "value": pm.request.url.path[0]}
                ]
    }
    
    
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



function makeThreads(channelId, numberOfThreads){
    let newThreads = [];
    while(numberOfThreads > 0){
        const newThread = {
            "id": "{{$randomInt}}",
            "featured_photo": "{{$randomCatsImage}}",
            "channel_id": channelId,
            "body_content": "{{$randomLoremSentences}}",
            "likes": "{{$randomInt}}",
            "title": "{{$randomPhrase}}",
            "created": "{{$randomDateRecent}}",
            "creator_id": "{{$randomInt}}",
            "creator_username": "{{$randomUserName}}"
        };
        numberOfThreads = numberOfThreads - 1;
        newThreads.push(newThread);

        // push to allThreads persisted obj
        // threads.push(newThread);
    }
    return threads;
}